import { describe, expect, it } from "vitest";
import {
  buildAdjacency,
  getProjectsUsingSkill,
  getRelatedSkills,
  validateSkillGraph,
} from "./graph";
import type { Skill, SkillRelation } from "./skill";

const validSkills: readonly Skill[] = [
  { id: "html", label: "HTML", category: "web" },
  { id: "css", label: "CSS", category: "web" },
];

describe("skill graph", () => {
  it("accepts a valid graph and matching project stack references", () => {
    expect(
      validateSkillGraph(validSkills, [["html", "css"]], [
        { id: "project", stack: [{ skillId: "html" }] },
      ]),
    ).toEqual([]);
  });

  it("reports malformed ids, categories, relations and stack references", () => {
    const invalidSkills = [
      ...validSkills,
      { id: "bad id", label: "Invalid", category: "unknown" },
      { id: "html", label: "Duplicate", category: "web" },
    ] as unknown as readonly Skill[];
    const relations: readonly SkillRelation[] = [
      ["missing", "css"],
      ["html", "html"],
      ["html", "css"],
      ["css", "html"],
    ];
    const issues = validateSkillGraph(invalidSkills, relations, [
      { id: "project", stack: [{ skillId: "unknown" }] },
    ]);

    expect(issues.map(({ code }) => code)).toEqual([
      "invalid-id",
      "invalid-category",
      "duplicate-id",
      "missing-skill",
      "self-relation",
      "duplicate-relation",
      "missing-stack-skill",
    ]);
  });

  it("builds symmetric adjacency and returns related skills and projects", () => {
    const adjacency = buildAdjacency([["html", "css"]]);

    expect([...adjacency.get("html") ?? []]).toEqual(["css"]);
    expect([...adjacency.get("css") ?? []]).toEqual(["html"]);
    const relations: readonly SkillRelation[] = [["javascript", "html"]];
    const sampleProjects = [
      { id: "site", stack: [{ skillId: "javascript" }] },
      { id: "app", stack: [{ skillId: "html" }] },
    ];

    expect(getRelatedSkills(relations, "javascript")).toEqual(["html"]);
    expect(getProjectsUsingSkill(sampleProjects, "javascript")).toEqual(["site"]);
  });
});
