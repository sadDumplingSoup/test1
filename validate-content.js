const fs = require("fs");
const vm = require("vm");

const context = { window: {} };
vm.createContext(context);
[
  "curriculum.js",
  "concepts.js",
  "theory.js",
  "narrative-engine.js",
  "lessons-foundation.js",
  "lessons-ml.js",
  "lessons-dl.js",
  "lessons-rl.js",
].forEach((file) => vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file }));

const topics = context.window.curriculumData.flatMap((module) => module.topics);
const lessons = context.window.theoryLessons;
const errors = [];
const required = ["scenario", "narrative", "formalDefinition", "steps", "workedExample", "comparison", "checks"];

topics.forEach((topic) => {
  const lesson = lessons[topic];
  if (!lesson) return errors.push(`${topic}: 缺少课程`);
  if (!lesson.authored) errors.push(`${topic}: 仍在使用回退内容`);
  required.forEach((field) => {
    if (!lesson[field] || (Array.isArray(lesson[field]) && !lesson[field].length)) errors.push(`${topic}: 缺少 ${field}`);
  });
  if (!lesson.scenario.paragraphs || lesson.scenario.paragraphs.length < 2) errors.push(`${topic}: 场景叙事不足`);
  if (lesson.narrative.length < 3) errors.push(`${topic}: 连贯概念段落不足`);
  if (lesson.steps.length < 4) errors.push(`${topic}: 核心步骤不足`);
  lesson.steps.forEach((step, index) => {
    ["input", "action", "why", "output", "next"].forEach((field) => {
      if (!step[field]) errors.push(`${topic}: 步骤 ${index + 1} 缺少 ${field}`);
    });
  });
  if (lesson.checks.length < 2) errors.push(`${topic}: 自测题不足`);
});

const topicSet = new Set(topics);
const extra = Object.keys(lessons).filter((topic) => !topicSet.has(topic));
const duplicateCount = topics.length - topicSet.size;
const serialized = JSON.stringify(lessons);
["这是“", "process_", "内部流程中的关键环节"].forEach((phrase) => {
  if (serialized.includes(phrase)) errors.push(`仍包含模板短语: ${phrase}`);
});
if (duplicateCount) errors.push(`大纲中有 ${duplicateCount} 个重复主题`);
if (extra.length) errors.push(`存在 ${extra.length} 个大纲外课程: ${extra.join("、")}`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const stageCounts = context.window.curriculumData.reduce((counts, module) => {
  counts[module.stage] = (counts[module.stage] || 0) + module.topics.length;
  return counts;
}, {});
console.log(JSON.stringify({ topics: topics.length, lessons: Object.keys(lessons).length, stageCounts, status: "OK" }, null, 2));
