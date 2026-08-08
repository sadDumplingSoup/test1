(function () {
  "use strict";

  const stageMeta = window.stageMeta;
  const modules = window.curriculumData;
  const projects = window.projectData;
  const lessonDetails = window.lessonDetails;
  const theoryLessons = window.theoryLessons || {};
  const algorithmConcepts = window.algorithmConcepts || {};
  const projectCodeData = window.projectCodeData || {};
  const storageKey = "zhijing-ai-learning-progress-v1";
  const themeKey = "zhijing-ai-theme";
  const allLessons = [];

  modules.forEach((module) => {
    module.topics.forEach((topic, topicIndex) => {
      allLessons.push({
        id: `${module.id}-${topicIndex + 1}`,
        topic,
        moduleId: module.id,
        moduleTitle: module.title,
        stage: module.stage,
        duration: estimateDuration(topic),
        module
      });
    });
  });

  const state = {
    completed: loadProgress(),
    currentFilter: "all",
    expanded: new Set(["F1", "M1", "D1", "R1"]),
    currentLessonIndex: 0,
    agentRunning: false,
    agentPosition: 0,
    currentProjectIndex: 0
  };

  const dom = {
    roadmapCards: document.getElementById("roadmapCards"),
    curriculumList: document.getElementById("curriculumList"),
    projectGrid: document.getElementById("projectGrid"),
    completedLessons: document.getElementById("completedLessons"),
    totalLessons: document.getElementById("totalLessons"),
    sidebarProgressRing: document.getElementById("sidebarProgressRing"),
    sidebarProgressText: document.getElementById("sidebarProgressText"),
    sidebarLessonCount: document.getElementById("sidebarLessonCount"),
    globalSearch: document.getElementById("globalSearch"),
    searchResults: document.getElementById("searchResults"),
    lessonModal: document.getElementById("lessonModal"),
    projectModal: document.getElementById("projectModal"),
    modalTitle: document.getElementById("modalTitle"),
    modalStage: document.getElementById("modalStage"),
    modalDifficulty: document.getElementById("modalDifficulty"),
    modalReadTime: document.getElementById("modalReadTime"),
    modalSummary: document.getElementById("modalSummary"),
    theoryReader: document.getElementById("theoryReader"),
    modalComplete: document.getElementById("modalComplete"),
    projectModalTitle: document.getElementById("projectModalTitle"),
    projectModalStage: document.getElementById("projectModalStage"),
    projectModalDifficulty: document.getElementById("projectModalDifficulty"),
    projectModalRuntime: document.getElementById("projectModalRuntime"),
    projectModalGoal: document.getElementById("projectModalGoal"),
    projectInstall: document.getElementById("projectInstall"),
    projectRunCommand: document.getElementById("projectRunCommand"),
    projectSteps: document.getElementById("projectSteps"),
    projectFilename: document.getElementById("projectFilename"),
    projectLineCount: document.getElementById("projectLineCount"),
    projectCodeContent: document.getElementById("projectCodeContent"),
    projectExpectedOutput: document.getElementById("projectExpectedOutput"),
    projectNotes: document.getElementById("projectNotes"),
    toast: document.getElementById("toast")
  };

  initialize();

  function initialize() {
    applySavedTheme();
    renderRoadmap();
    renderCurriculum();
    renderProjects();
    setupProjectEvents();
    updateProgress();
    setupNavigation();
    setupCurriculumEvents();
    setupSearch();
    setupModal();
    setupLabs();
    setupGlobalControls();
    updateStreak();
    document.getElementById("statModules").textContent = modules.length;
    document.getElementById("statLessons").textContent = allLessons.length;
    document.getElementById("totalLessons").textContent = allLessons.length;
  }

  function renderRoadmap() {
    dom.roadmapCards.innerHTML = Object.entries(stageMeta).map(([stage, meta]) => {
      const stageModules = modules.filter((module) => module.stage === stage);
      const lessons = allLessons.filter((lesson) => lesson.stage === stage);
      const completed = lessons.filter((lesson) => state.completed.has(lesson.id)).length;
      const progress = lessons.length ? Math.round(completed / lessons.length * 100) : 0;
      return `
        <article class="roadmap-card" data-stage="${stage}" style="--stage-color:${meta.color}" tabindex="0">
          <span class="roadmap-index">STAGE ${String(meta.order).padStart(2, "0")}</span>
          <h3>${meta.name}</h3>
          <p>${meta.subtitle}。按建议节奏约 ${meta.duration}。</p>
          <div class="roadmap-meta"><span>${stageModules.length} 模块</span><span>${lessons.length} 知识点</span></div>
          <div class="roadmap-progress">
            <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
            <small>${completed ? `已完成 ${completed} 项 · ${progress}%` : "尚未开始"}</small>
          </div>
        </article>`;
    }).join("");

    dom.roadmapCards.querySelectorAll(".roadmap-card").forEach((card) => {
      const openStage = () => {
        state.currentFilter = card.dataset.stage;
        syncFilters();
        renderCurriculum();
        document.getElementById("curriculum").scrollIntoView({ behavior: "smooth" });
      };
      card.addEventListener("click", openStage);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") openStage();
      });
    });
  }

  function renderCurriculum() {
    const visible = state.currentFilter === "all"
      ? modules
      : modules.filter((module) => module.stage === state.currentFilter);

    if (!visible.length) {
      dom.curriculumList.innerHTML = '<div class="no-modules">没有找到匹配的课程。</div>';
      return;
    }

    dom.curriculumList.innerHTML = visible.map((module) => {
      const meta = stageMeta[module.stage];
      const lessonItems = allLessons.filter((lesson) => lesson.moduleId === module.id);
      const completed = lessonItems.filter((lesson) => state.completed.has(lesson.id)).length;
      const progress = Math.round(completed / lessonItems.length * 100);
      const isOpen = state.expanded.has(module.id);

      return `
        <article class="module-card ${isOpen ? "open" : ""}" data-module-id="${module.id}" style="--stage-color:${meta.color}">
          <button class="module-header" aria-expanded="${isOpen}">
            <span class="module-number">${module.id}</span>
            <span class="module-title"><strong>${module.title}</strong><small>${module.description} · ${module.duration}</small></span>
            <span class="module-progress"><span class="progress-track"><span class="progress-fill" style="width:${progress}%"></span></span><small>${completed}/${lessonItems.length}</small></span>
            <span class="module-toggle">⌄</span>
          </button>
          <div class="lesson-list">
            ${lessonItems.map((lesson) => `
              <button class="lesson-item ${state.completed.has(lesson.id) ? "completed" : ""}" data-lesson-id="${lesson.id}">
                <span class="lesson-check">✓</span>
                <span class="lesson-name"><strong>${escapeHtml(lesson.topic)}</strong><small>${meta.short} · ${module.title}</small></span>
                <span class="lesson-time">${lesson.duration}</span>
              </button>`).join("")}
          </div>
        </article>`;
    }).join("");
  }

  function renderProjects() {
    dom.projectGrid.innerHTML = projects.map((project, index) => {
      const meta = stageMeta[project.stage];
      return `
        <article class="project-card" style="--project-color:${meta.color}">
          <div class="project-top"><span class="project-icon">${project.icon}</span><span class="difficulty-tag">${project.difficulty}</span></div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-skills">${project.skills.map((skill) => `<span>${skill}</span>`).join("")}</div>
          <button class="project-open-button" data-project-index="${index}"><span>⌘</span> 查看完整代码 <i>→</i></button>
        </article>`;
    }).join("");
  }

  function setupProjectEvents() {
    dom.projectGrid.addEventListener("click", (event) => {
      const button = event.target.closest(".project-open-button");
      if (!button) return;
      openProject(Number(button.dataset.projectIndex));
    });

    document.getElementById("projectModalClose").addEventListener("click", closeProjectModal);
    document.getElementById("projectCloseAction").addEventListener("click", closeProjectModal);
    dom.projectModal.addEventListener("click", (event) => {
      if (event.target === dom.projectModal) closeProjectModal();
    });
    document.getElementById("projectPrev").addEventListener("click", () => navigateProject(-1));
    document.getElementById("projectNext").addEventListener("click", () => navigateProject(1));
    document.getElementById("copyProjectCode").addEventListener("click", copyCurrentProjectCode);
    document.getElementById("downloadProjectCode").addEventListener("click", downloadCurrentProjectCode);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !dom.projectModal.hidden) closeProjectModal();
      if (!dom.projectModal.hidden && event.altKey && event.key === "ArrowLeft") navigateProject(-1);
      if (!dom.projectModal.hidden && event.altKey && event.key === "ArrowRight") navigateProject(1);
    });
  }

  function openProject(index) {
    state.currentProjectIndex = index;
    populateProjectModal(index);
    dom.projectModal.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("projectModalClose").focus();
  }

  function populateProjectModal(index) {
    const project = projects[index];
    const details = projectCodeData[project.title];
    const meta = stageMeta[project.stage];
    if (!details) {
      showToast("该项目代码正在整理中");
      return;
    }

    const code = details.code.replace(/^\n+|\n+$/g, "");
    const lines = code.split("\n");
    dom.projectModal.style.setProperty("--project-modal-color", meta.color);
    dom.projectModalTitle.textContent = project.title;
    dom.projectModalStage.textContent = meta.short;
    dom.projectModalDifficulty.textContent = project.difficulty;
    dom.projectModalRuntime.textContent = details.runtime;
    dom.projectModalGoal.textContent = details.goal;
    dom.projectInstall.textContent = details.install;
    dom.projectRunCommand.textContent = `python ${details.filename}`;
    dom.projectSteps.innerHTML = details.steps.map((item, stepIndex) => `<li><span>${String(stepIndex + 1).padStart(2, "0")}</span><p>${escapeHtml(item)}</p></li>`).join("");
    dom.projectFilename.textContent = details.filename;
    dom.projectLineCount.textContent = `${lines.length} 行`;
    dom.projectCodeContent.innerHTML = lines.map((line, lineIndex) => `<span class="project-code-line"><i>${String(lineIndex + 1).padStart(3, "0")}</i><b>${formatPythonLine(line)}</b></span>`).join("\n");
    dom.projectExpectedOutput.textContent = details.output;
    dom.projectNotes.innerHTML = details.notes.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    dom.projectModal.scrollTop = 0;
  }

  function navigateProject(direction) {
    state.currentProjectIndex = (state.currentProjectIndex + direction + projects.length) % projects.length;
    populateProjectModal(state.currentProjectIndex);
  }

  function closeProjectModal() {
    dom.projectModal.hidden = true;
    document.body.style.overflow = "";
  }

  async function copyCurrentProjectCode() {
    const project = projects[state.currentProjectIndex];
    const code = projectCodeData[project.title].code.trim();
    try {
      await navigator.clipboard.writeText(code);
    } catch (_) {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    showToast("完整代码已复制");
  }

  function downloadCurrentProjectCode() {
    const project = projects[state.currentProjectIndex];
    const details = projectCodeData[project.title];
    const blob = new Blob([details.code.trim() + "\n"], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = details.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast(`已下载 ${details.filename}`);
  }

  function formatPythonLine(line) {
    const safe = escapeHtml(line);
    if (safe.trim().startsWith("#")) return `<em>${safe}</em>`;
    return safe.replace(/\b(import|from|as|class|def|return|for|while|if|else|elif|with|in|not|and|or|True|False|None|try|except|raise|global)\b/g, '<strong class="python-keyword">$1</strong>');
  }

  function setupCurriculumEvents() {
    dom.curriculumList.addEventListener("click", (event) => {
      const header = event.target.closest(".module-header");
      const lessonItem = event.target.closest(".lesson-item");
      if (header) {
        const card = header.closest(".module-card");
        const moduleId = card.dataset.moduleId;
        state.expanded.has(moduleId) ? state.expanded.delete(moduleId) : state.expanded.add(moduleId);
        card.classList.toggle("open");
        header.setAttribute("aria-expanded", card.classList.contains("open"));
      }
      if (lessonItem) openLessonById(lessonItem.dataset.lessonId);
    });

    document.getElementById("stageFilters").addEventListener("click", (event) => {
      const button = event.target.closest(".filter-pill");
      if (!button) return;
      state.currentFilter = button.dataset.filter;
      syncFilters();
      renderCurriculum();
    });

    document.getElementById("expandAll").addEventListener("click", (event) => {
      const visibleModules = state.currentFilter === "all" ? modules : modules.filter((module) => module.stage === state.currentFilter);
      const allExpanded = visibleModules.every((module) => state.expanded.has(module.id));
      visibleModules.forEach((module) => allExpanded ? state.expanded.delete(module.id) : state.expanded.add(module.id));
      event.currentTarget.textContent = allExpanded ? "全部展开" : "全部收起";
      renderCurriculum();
    });
  }

  function syncFilters() {
    document.querySelectorAll(".filter-pill").forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === state.currentFilter);
    });
  }

  function setupSearch() {
    const input = dom.globalSearch;
    input.addEventListener("input", () => renderSearchResults(input.value));
    input.addEventListener("focus", () => {
      if (input.value.trim()) renderSearchResults(input.value);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        dom.searchResults.hidden = true;
        input.blur();
      }
      if (event.key === "Enter") {
        const first = dom.searchResults.querySelector(".search-result");
        if (first) first.click();
      }
    });
    dom.searchResults.addEventListener("click", (event) => {
      const result = event.target.closest(".search-result");
      if (!result) return;
      openLessonById(result.dataset.lessonId);
      dom.searchResults.hidden = true;
      input.value = "";
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".global-search")) dom.searchResults.hidden = true;
    });
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        input.focus();
      }
    });
  }

  function renderSearchResults(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      dom.searchResults.hidden = true;
      return;
    }
    const matches = allLessons.filter((lesson) => {
      const searchable = `${lesson.topic} ${lesson.moduleTitle} ${stageMeta[lesson.stage].name} ${lesson.module.description}`.toLowerCase();
      return searchable.includes(normalized);
    }).slice(0, 9);

    dom.searchResults.innerHTML = matches.length ? matches.map((lesson) => `
      <button class="search-result" data-lesson-id="${lesson.id}">
        <span class="result-index" style="background:${stageMeta[lesson.stage].color}">${lesson.moduleId}</span>
        <span><strong>${highlightText(lesson.topic, query)}</strong><small>${lesson.moduleTitle}</small></span>
        <small>${stageMeta[lesson.stage].short}</small>
      </button>`).join("") : '<div class="search-empty">没有找到相关知识点，换个关键词试试。</div>';
    dom.searchResults.hidden = false;
  }

  function setupModal() {
    document.getElementById("modalClose").addEventListener("click", closeModal);
    dom.lessonModal.addEventListener("click", (event) => {
      if (event.target === dom.lessonModal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !dom.lessonModal.hidden) closeModal();
      if (!dom.lessonModal.hidden && event.key === "ArrowRight") navigateLesson(1);
      if (!dom.lessonModal.hidden && event.key === "ArrowLeft") navigateLesson(-1);
    });
    document.getElementById("modalPrev").addEventListener("click", () => navigateLesson(-1));
    document.getElementById("modalNext").addEventListener("click", () => navigateLesson(1));
    dom.modalComplete.addEventListener("click", toggleCurrentLesson);
  }

  function openLessonById(id) {
    const index = allLessons.findIndex((lesson) => lesson.id === id);
    if (index < 0) return;
    state.currentLessonIndex = index;
    populateModal(allLessons[index]);
    dom.lessonModal.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("modalClose").focus();
  }

  function populateModal(lesson) {
    const meta = stageMeta[lesson.stage];
    const custom = lessonDetails[lesson.topic];
    const basicDetail = custom || makeGenericDetail(lesson);
    const theory = theoryLessons[lesson.topic] || makeStructuredTheory(lesson, basicDetail);
    dom.lessonModal.style.setProperty("--modal-color", meta.color);
    dom.modalStage.textContent = `${meta.short} · ${lesson.moduleId}`;
    dom.modalDifficulty.textContent = getDifficulty(lesson.stage);
    dom.modalReadTime.textContent = `约 ${theory.readTime || 12} 分钟`;
    dom.modalTitle.textContent = lesson.topic;
    dom.modalSummary.textContent = theory.summary || basicDetail.summary;
    dom.theoryReader.innerHTML = renderTheoryLesson(theory, basicDetail, lesson);
    dom.theoryReader.scrollTop = 0;
    updateModalCompleteButton(lesson);
  }

  function renderTheoryLesson(theory, basicDetail, lesson) {
    const concept = algorithmConcepts[lesson.topic] || makeBasicConcept(lesson, basicDetail);
    const prerequisites = theory.prerequisites || getPrerequisites(lesson);
    const objectives = theory.objectives || basicDetail.objectives;
    const steps = theory.steps || [];
    const formulas = theory.formulas || [];
    const example = theory.workedExample || theory.example;
    const pseudocode = theory.pseudocode || [];
    const strengths = theory.strengths || [];
    const limitations = theory.limitations || [];
    const pitfalls = theory.pitfalls || [];
    const checks = theory.checks || [];
    const scenario = theory.scenario || { title: lesson.topic, paragraphs: [theory.intuition || basicDetail.concept], question: `它为什么能解决“${lesson.topic}”对应的问题？` };
    const narrative = theory.narrative || [theory.intuition || basicDetail.concept];
    const formalDefinition = theory.formalDefinition || concept.definition;
    const vocabulary = theory.vocabulary || concept.core || [];
    const comparison = theory.comparison || [];
    let nextSectionNumber = 4;
    const formulaNumber = formulas.length ? String(nextSectionNumber++).padStart(2, "0") : null;
    const exampleNumber = example ? String(nextSectionNumber++).padStart(2, "0") : null;
    const codeNumber = pseudocode.length ? String(nextSectionNumber++).padStart(2, "0") : null;
    const boundaryNumber = String(nextSectionNumber++).padStart(2, "0");
    const reviewNumber = String(nextSectionNumber).padStart(2, "0");

    return `
      <nav class="reader-toc" aria-label="本课目录">
        <a href="#reader-scenario">问题场景</a>
        <a href="#reader-concept">概念形成</a>
        <a href="#reader-steps">核心机制</a>
        ${formulas.length ? '<a href="#reader-formulas">公式推演</a>' : ""}
        ${example ? '<a href="#reader-example">完整例题</a>' : ""}
        ${pseudocode.length ? '<a href="#reader-code">流程代码</a>' : ""}
        <a href="#reader-boundaries">方法边界</a>
        <a href="#reader-review">总结自测</a>
      </nav>

      <section class="reader-overview">
        <div class="reader-meta-block">
          <span class="reader-label">建议先掌握</span>
          <div class="prerequisite-list">${prerequisites.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        </div>
        <div class="reader-meta-block">
          <span class="reader-label">本节学习目标</span>
          <ul class="objective-list">${objectives.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
      </section>

      <section class="theory-section" id="reader-scenario">
        <div class="theory-section-title"><span>01</span><div><small>START WITH A PROBLEM</small><h3>先从一个真实问题开始</h3></div></div>
        <article class="scenario-story">
          <span class="story-label">场景</span>
          <h4>${escapeHtml(scenario.title)}</h4>
          ${(scenario.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          ${scenario.question ? `<div class="story-question"><strong>现在的问题是：</strong>${escapeHtml(scenario.question)}</div>` : ""}
        </article>
      </section>

      <section class="theory-section" id="reader-concept">
        <div class="theory-section-title"><span>02</span><div><small>BUILD THE CONCEPT</small><h3>沿着例子，把概念连起来</h3></div></div>
        <div class="narrative-prose">${narrative.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
        ${vocabulary.length ? `<div class="inline-vocabulary"><h4>例子里出现的关键词</h4>${vocabulary.map(([term, meaning]) => `<p><strong>${escapeHtml(term)}</strong><span>${escapeHtml(meaning)}</span></p>`).join("")}</div>` : ""}
        <div class="concept-definition"><span>现在再看严格定义</span><p>${escapeHtml(formalDefinition)}</p></div>
        <div class="concept-distinction"><strong>容易混淆的地方：</strong>${escapeHtml(theory.distinction || concept.distinction)}</div>
      </section>

      <section class="theory-section" id="reader-steps">
        <div class="theory-section-title"><span>03</span><div><small>HOW IT WORKS</small><h3>核心步骤：它到底如何工作？</h3></div></div>
        <div class="algorithm-steps">${steps.map((item, index) => `
          <article class="algorithm-step">
            <div class="step-index">${String(index + 1).padStart(2, "0")}</div>
            <div class="step-body">
              <h4>${escapeHtml(item.title)}</h4>
              ${item.input ? `<div class="step-flow-row"><span>已有信息</span><p>${escapeHtml(item.input)}</p></div>` : ""}
              <div class="step-flow-row step-action"><span>执行操作</span><p>${escapeHtml(item.action || item.description)}</p></div>
              ${item.why ? `<div class="step-flow-row"><span>为什么</span><p>${escapeHtml(item.why)}</p></div>` : ""}
              ${item.expression ? `<div class="step-formula"><code>${escapeHtml(item.expression)}</code></div>` : ""}
              ${item.output ? `<div class="step-flow-row step-output"><span>阶段结果</span><p>${escapeHtml(item.output)}</p></div>` : ""}
              ${item.next ? `<p class="step-next">${escapeHtml(item.next)}</p>` : ""}
              ${item.note ? `<div class="step-note"><strong>注意：</strong>${escapeHtml(item.note)}</div>` : ""}
            </div>
          </article>`).join("")}</div>
        ${renderVisualAid(theory.visualAid)}
      </section>

      ${formulas.length ? `
        <section class="theory-section" id="reader-formulas">
          <div class="theory-section-title"><span>${formulaNumber}</span><div><small>FORMULAS</small><h3>关键公式与符号解释</h3></div></div>
          <div class="formula-list">${formulas.map((item) => `
            <article class="formula-explainer">
              <div class="formula-heading"><span>${escapeHtml(item.name)}</span><code>${escapeHtml(item.expression)}</code></div>
              <p>${escapeHtml(item.explanation)}</p>
              ${item.symbols && item.symbols.length ? `<dl class="symbol-list">${item.symbols.map(([symbol, meaning]) => `<div><dt>${escapeHtml(symbol)}</dt><dd>${escapeHtml(meaning)}</dd></div>`).join("")}</dl>` : ""}
              ${item.substitution ? `<div class="formula-substitution"><strong>代入数字：</strong>${escapeHtml(item.substitution)}</div>` : ""}
            </article>`).join("")}</div>
        </section>` : ""}

      ${example ? `
        <section class="theory-section" id="reader-example">
          <div class="theory-section-title"><span>${exampleNumber}</span><div><small>WORKED EXAMPLE</small><h3>从输入到结论，完整走一遍</h3></div></div>
          <article class="worked-example">
            <h4>${escapeHtml(example.title)}</h4>
            <p>${escapeHtml(example.description)}</p>
            <ol>${example.calculations.map((calculation) => `<li>${escapeHtml(calculation)}</li>`).join("")}</ol>
          </article>
        </section>` : ""}

      ${pseudocode.length ? `
        <section class="theory-section" id="reader-code">
          <div class="theory-section-title"><span>${codeNumber}</span><div><small>PROCESS</small><h3>把机制翻译成可执行流程</h3></div></div>
          <div class="pseudocode-card"><div class="code-top"><span></span><span></span><span></span><small>algorithm.txt</small></div><pre><code>${pseudocode.map((line, index) => `<span><i>${String(index + 1).padStart(2, "0")}</i>${escapeHtml(line)}</span>`).join("\n")}</code></pre></div>
        </section>` : ""}

      <section class="theory-section" id="reader-boundaries">
        <div class="theory-section-title"><span>${boundaryNumber}</span><div><small>CHOOSE WITH REASONS</small><h3>什么时候使用，什么时候换方法</h3></div></div>
        ${comparison.length ? `<div class="comparison-list">${comparison.map((item) => `<article><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.text)}</p></article>`).join("")}</div>` : ""}
        ${(strengths.length || limitations.length) ? `<div class="tradeoff-grid">
          <article><span class="tradeoff-good">适合与优势</span><ul>${strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
          <article><span class="tradeoff-limit">限制与代价</span><ul>${limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
        </div>` : ""}
        ${pitfalls.length ? `<div class="pitfall-card"><h4>常见误区</h4><ol>${pitfalls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></div>` : ""}
      </section>

      <section class="theory-section" id="reader-review">
        <div class="theory-section-title"><span>${reviewNumber}</span><div><small>REVIEW</small><h3>总结、自测与独立练习</h3></div></div>
        ${checks.length ? `<div class="knowledge-check"><h4>理解自测 <small>点击查看答案</small></h4>${checks.map(([question, answer], index) => `<details><summary><span>${index + 1}</span>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div>` : ""}
        <div class="practice-assignment"><span>✎ 课后练习</span><p>${escapeHtml(theory.practice || basicDetail.practice)}</p></div>
      </section>`;
  }

  function renderVisualAid(visualAid) {
    if (!visualAid || !visualAid.items || !visualAid.items.length) return "";
    if (visualAid.type === "table") {
      const rows = visualAid.items;
      return `<div class="lesson-visual"><small>例子数据</small><div class="visual-table">${rows.map((row) => `<div>${row.map((cell) => `<span>${escapeHtml(cell)}</span>`).join("")}</div>`).join("")}</div></div>`;
    }
    return `<div class="lesson-visual"><small>信息如何向前流动</small><div class="visual-flow">${visualAid.items.map((item) => `<span>${escapeHtml(item)}</span>`).join("<i>→</i>")}</div></div>`;
  }

  function makeBasicConcept(lesson, basicDetail) {
    const algorithmLike = /回归|分类|聚类|树|网络|学习|算法|优化|搜索|采样|检测|降维|注意力|Transformer|PCA|RNN|CNN|GAN|VAE|DQN|PPO|SAC/i.test(lesson.topic);
    return {
      definition: algorithmLike
        ? `“${lesson.topic}”是${lesson.moduleTitle}中的一种方法或计算机制。${basicDetail.summary}`
        : `“${lesson.topic}”是${lesson.moduleTitle}中的基础概念。${basicDetail.summary}`,
      problem: lesson.module.description,
      input: algorithmLike ? "与任务对应的样本、必要参数以及该方法要求的数据表示。" : "需要结合当前模块中的数据、符号或上下文进行理解。",
      output: algorithmLike ? "经过该方法计算得到的预测、表示、参数估计或决策结果。" : "可以用于解释、计算或连接后续知识的明确结论。",
      core: [
        ["输入", "进入该概念或方法的数据、条件与已有信息。"],
        ["内部过程", `“${lesson.topic}”处理输入时采用的关键规则或关系。`],
        ["输出", "完成处理后得到的结果，以及结果应如何解释。"],
        ["适用前提", "方法成立所依赖的数据特征、假设和使用场景。"]
      ],
      distinction: `它不能脱离“${lesson.moduleTitle}”的任务背景机械使用。需要同时理解前提、过程和结果，而不只是记住名称。`
    };
  }

  function makeStructuredTheory(lesson, basicDetail) {
    const concept = algorithmConcepts[lesson.topic];
    const isAlgorithm = Boolean(concept) || /回归|分类|聚类|树|网络|学习|算法|优化|搜索|采样|检测|降维|Attention|Transformer|PCA|RNN|CNN|GAN|VAE|DQN|PPO|SAC/i.test(lesson.topic);
    const conceptSteps = concept ? [
      { title: "确认问题与输入", description: `${concept.problem} 开始前需要准备：${concept.input}` },
      ...concept.core.map(([term, meaning], index) => ({
        title: `${index === 0 ? "建立" : index === concept.core.length - 1 ? "完成" : "处理"} ${term}`,
        description: `${meaning} 请结合该课程的正式内容确认这一概念在计算过程中的实际位置。`
      })),
      { title: "形成输出并解释", description: `${concept.output} 结果不能只看数值，还要结合适用前提和评价指标判断是否可信。` },
      { title: "与相近方法比较", description: concept.distinction }
    ] : null;
    return {
      readTime: isAlgorithm ? 14 : 10,
      prerequisites: getPrerequisites(lesson),
      summary: basicDetail.summary,
      intuition: basicDetail.concept,
      objectives: basicDetail.objectives,
      steps: conceptSteps || (isAlgorithm ? [
        { title: "明确任务与适用条件", description: `先判断“${lesson.topic}”要解决的问题、数据形式与输出目标。不要从调用代码开始，而要先确认它是否适合当前任务。` },
        { title: "准备输入数据", description: "检查样本、特征与标签的含义，处理缺失、尺度或编码问题，并严格分离训练数据与评估数据。" },
        { title: "理解核心表示", description: `${lesson.module.focus} 在这一知识点中，要特别分清输入、模型内部状态、可学习参数和最终输出。` },
        { title: "执行核心计算", description: `按照“输入 → ${lesson.topic} 的核心规则 → 输出”的顺序完成一次最小手算或代码演示，并记录每一步张量或数据的形状。` },
        { title: "根据目标进行学习或求解", description: "如果包含可学习参数，需要定义目标函数并选择优化方法；如果是确定性过程，需要明确停止条件和结果判定规则。" },
        { title: "评价结果", description: "选择与任务目标一致的指标，并同时检查训练表现、验证表现、稳定性以及是否存在数据泄漏。" },
        { title: "分析限制并改进", description: "改变一个参数或数据条件，观察结果如何变化；总结它在哪些条件下有效、何时会失败以及可使用什么替代方案。" }
      ] : [
        { title: "给出精确定义", description: `先说明“${lesson.topic}”是什么，并区分它与相近概念。定义中出现的每个术语都应能单独解释。` },
        { title: "说明它解决的问题", description: "把概念放回完整任务中，说明为什么需要它、没有它会出现什么问题。" },
        { title: "拆解组成部分", description: "识别相关对象、输入输出、关键条件和彼此关系，用一张小图或表格重新组织。" },
        { title: "完成最小示例", description: "选择少量数字或简单场景，从头走一遍概念的使用过程，不跳过中间步骤。" },
        { title: "连接前后知识", description: `说明它如何依赖“${lesson.moduleTitle}”中的其他知识，以及后续哪些模型或项目会使用它。` },
        { title: "验证是否掌握", description: "尝试不用术语向他人解释，再做一道判断题和一个代码或手算练习。" }
      ]),
      example: concept ? {
        title: `用最小场景理解 ${lesson.topic}`,
        description: `先不处理复杂数据，只沿着“输入—核心机制—输出”走一遍 ${lesson.topic}。`,
        calculations: [
          `任务：${concept.problem}`,
          `准备输入：${concept.input}`,
          ...concept.core.slice(0, 3).map(([term, meaning]) => `${term}：${meaning}`),
          `得到输出：${concept.output}`,
          `检查区别：${concept.distinction}`
        ]
      } : undefined,
      pseudocode: concept ? [
        `input = prepare_data()  # ${concept.input}`,
        "validate(input)",
        ...concept.core.map(([term]) => `apply_${toPseudoName(term)}()`),
        `result = build_${toPseudoName(lesson.topic)}()`,
        `evaluate(result)  # ${concept.output}`
      ] : [],
      strengths: ["帮助建立当前模块的完整知识链", "可直接连接后续代码和项目实践"],
      limitations: ["单独记忆定义不足以形成迁移能力", "具体使用条件仍需要通过数据和实验验证"],
      pitfalls: ["只背结论而不理解输入输出", "能看懂示例，却无法独立完成最小练习", "忽略适用前提，把方法机械套到所有问题"],
      checks: [[`你能否不用原文解释“${lesson.topic}”？`, "如果能同时说清它解决的问题、关键机制和一个例子，才算形成了初步理解。"], ["如何确认自己不是只记住了术语？", "关闭材料，独立画出流程、解释每一步，并改变一个条件预测结果。"]],
      practice: basicDetail.practice
    };
  }

  function toPseudoName(value) {
    return String(value)
      .replace(/[()（）·、\s/+-]+/g, "_")
      .replace(/[^\w\u4e00-\u9fa5]/g, "")
      .replace(/^_+|_+$/g, "")
      .toLowerCase();
  }

  function getPrerequisites(lesson) {
    const lessonsInModule = allLessons.filter((item) => item.moduleId === lesson.moduleId);
    const currentIndex = lessonsInModule.findIndex((item) => item.id === lesson.id);
    const previousTopics = lessonsInModule.slice(Math.max(0, currentIndex - 2), currentIndex).map((item) => item.topic);
    if (previousTopics.length) return previousTopics;
    const stageDefaults = {
      foundation: ["Python 基础", "基本数学符号"],
      ml: ["Python 与 NumPy", "训练集与测试集", "基础统计"],
      dl: ["机器学习基础", "矩阵运算", "梯度下降"],
      rl: ["概率与期望", "神经网络基础", "强化学习核心概念"]
    };
    return stageDefaults[lesson.stage];
  }

  function makeGenericDetail(lesson) {
    return {
      summary: `${lesson.topic}属于“${lesson.moduleTitle}”模块。${lesson.module.description}`,
      concept: `${lesson.module.focus} 学习“${lesson.topic}”时，重点关注它解决的问题、输入输出、核心步骤、适用条件与局限。`,
      objectives: [
        `能用自己的话解释“${lesson.topic}”`,
        "能识别它适用的任务和必要前提",
        "能使用代码或手算完成一个最小示例"
      ],
      practice: `${lesson.module.practice} 完成后，再写一段不超过 100 字的总结，说明本知识点在任务中发挥的作用。`
    };
  }

  function navigateLesson(direction) {
    state.currentLessonIndex = (state.currentLessonIndex + direction + allLessons.length) % allLessons.length;
    populateModal(allLessons[state.currentLessonIndex]);
  }

  function toggleCurrentLesson() {
    const lesson = allLessons[state.currentLessonIndex];
    if (state.completed.has(lesson.id)) {
      state.completed.delete(lesson.id);
      showToast("已取消完成标记");
    } else {
      state.completed.add(lesson.id);
      showToast("完成一个知识点，继续保持！");
    }
    saveProgress();
    updateModalCompleteButton(lesson);
    renderCurriculum();
    renderRoadmap();
    updateProgress();
  }

  function updateModalCompleteButton(lesson) {
    const done = state.completed.has(lesson.id);
    dom.modalComplete.classList.toggle("done", done);
    dom.modalComplete.textContent = done ? "✓ 已完成（点击取消）" : "标记为已完成";
  }

  function closeModal() {
    dom.lessonModal.hidden = true;
    document.body.style.overflow = "";
  }

  function updateProgress() {
    const completed = state.completed.size;
    const percent = Math.round(completed / allLessons.length * 100);
    dom.completedLessons.textContent = completed;
    dom.sidebarProgressText.textContent = `${percent}%`;
    dom.sidebarLessonCount.textContent = `${completed} / ${allLessons.length} 个知识点`;
    dom.sidebarProgressRing.style.setProperty("--progress", percent);
  }

  function setupLabs() {
    document.querySelectorAll(".lab-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".lab-tab").forEach((item) => item.classList.toggle("active", item === tab));
        document.querySelectorAll(".lab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `lab-${tab.dataset.lab}`));
        if (tab.dataset.lab === "regression") drawRegression();
      });
    });
    document.getElementById("slopeSlider").addEventListener("input", drawRegression);
    createNetworkDiagram();
    document.getElementById("runNetwork").addEventListener("click", runNetworkAnimation);
    createGridworld();
    document.getElementById("runAgent").addEventListener("click", runAgent);
    document.getElementById("resetAgent").addEventListener("click", resetAgent);
    drawRegression();
    window.addEventListener("resize", debounce(drawRegression, 120));
  }

  function drawRegression() {
    const canvas = document.getElementById("regressionCanvas");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const slider = document.getElementById("slopeSlider");
    const slope = Number(slider.value);
    const points = [[1,1.5],[2,2.2],[3,2.9],[4,4.3],[5,4.7],[6,5.8],[7,6.1],[8,7.5],[9,8.1]];
    const intercept = .55;
    const width = canvas.width;
    const height = canvas.height;
    const pad = 54;
    const style = getComputedStyle(document.body);
    const surface = style.getPropertyValue("--surface").trim();
    const muted = style.getPropertyValue("--muted").trim();
    const line = style.getPropertyValue("--line").trim();
    const coral = style.getPropertyValue("--coral").trim();
    const blue = style.getPropertyValue("--blue").trim();
    const xScale = (x) => pad + x / 10 * (width - pad * 2);
    const yScale = (y) => height - pad - y / 10 * (height - pad * 2);
    context.clearRect(0,0,width,height);
    context.fillStyle = surface;
    context.fillRect(0,0,width,height);

    context.strokeStyle = line;
    context.lineWidth = 1;
    context.font = "11px Segoe UI";
    context.fillStyle = muted;
    for (let index = 0; index <= 10; index += 2) {
      const x = xScale(index);
      const y = yScale(index);
      context.beginPath(); context.moveTo(x,pad); context.lineTo(x,height-pad); context.stroke();
      context.beginPath(); context.moveTo(pad,y); context.lineTo(width-pad,y); context.stroke();
      context.fillText(String(index), x - 4, height - pad + 20);
      if (index > 0) context.fillText(String(index), pad - 25, y + 4);
    }

    context.strokeStyle = coral;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(xScale(0), yScale(intercept));
    context.lineTo(xScale(10), yScale(slope * 10 + intercept));
    context.stroke();

    let squaredError = 0;
    points.forEach(([x, y]) => {
      const predicted = slope * x + intercept;
      squaredError += Math.pow(y - predicted, 2);
      context.strokeStyle = "rgba(240,111,85,.35)";
      context.lineWidth = 1;
      context.beginPath(); context.moveTo(xScale(x),yScale(y)); context.lineTo(xScale(x),yScale(predicted)); context.stroke();
      context.fillStyle = blue;
      context.beginPath(); context.arc(xScale(x),yScale(y),5,0,Math.PI*2); context.fill();
      context.fillStyle = surface;
      context.beginPath(); context.arc(xScale(x),yScale(y),2,0,Math.PI*2); context.fill();
    });
    const mse = squaredError / points.length;
    document.getElementById("slopeValue").textContent = slope.toFixed(2);
    document.getElementById("mseValue").textContent = mse.toFixed(3);
    document.getElementById("fitMessage").textContent = mse < .15 ? "拟合得很好！你找到了低误差区域" : mse < .8 ? "已经接近，继续小幅调整" : "继续调整，寻找更低的误差";
  }

  function createNetworkDiagram() {
    const svg = document.getElementById("networkSvg");
    const layers = [
      [{x:90,y:110,label:"x₁"},{x:90,y:200,label:"x₂"},{x:90,y:290,label:"x₃"}],
      [{x:320,y:75,label:"h₁"},{x:320,y:155,label:"h₂"},{x:320,y:235,label:"h₃"},{x:320,y:315,label:"h₄"}],
      [{x:560,y:155,label:"P₀"},{x:560,y:245,label:"P₁"}]
    ];
    let markup = "";
    layers.slice(0,-1).forEach((layer, layerIndex) => {
      layer.forEach((source) => layers[layerIndex + 1].forEach((target) => {
        markup += `<line class="network-edge" data-from="${layerIndex}" x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}"/>`;
      }));
    });
    layers.forEach((layer, layerIndex) => layer.forEach((node) => {
      markup += `<g class="network-node" data-layer="${layerIndex}" transform="translate(${node.x} ${node.y})"><circle r="24"/><text y="4">${node.label}</text></g>`;
    }));
    svg.innerHTML = markup;
  }

  async function runNetworkAnimation() {
    const button = document.getElementById("runNetwork");
    if (button.disabled) return;
    button.disabled = true;
    const edges = [...document.querySelectorAll(".network-edge")];
    const nodes = [...document.querySelectorAll(".network-node")];
    edges.forEach((edge) => edge.classList.remove("firing"));
    nodes.forEach((node) => node.classList.remove("firing"));
    for (let layer = 0; layer < 3; layer++) {
      nodes.filter((node) => Number(node.dataset.layer) === layer).forEach((node) => node.classList.add("firing"));
      if (layer < 2) edges.filter((edge) => Number(edge.dataset.from) === layer).forEach((edge) => edge.classList.add("firing"));
      await wait(520);
    }
    await wait(450);
    nodes.forEach((node) => node.classList.remove("firing"));
    edges.forEach((edge) => edge.classList.remove("firing"));
    button.disabled = false;
  }

  function createGridworld() {
    const world = document.getElementById("gridworld");
    const walls = [6, 11, 13, 18];
    const traps = [4, 12, 21];
    const goal = 24;
    world.innerHTML = Array.from({length:25}, (_, index) => {
      const type = walls.includes(index) ? "wall" : traps.includes(index) ? "trap" : index === goal ? "goal" : "";
      return `<div class="grid-cell ${type}" data-index="${index}"></div>`;
    }).join("");
    renderAgent();
  }

  function renderAgent() {
    document.querySelectorAll(".grid-agent").forEach((agent) => agent.remove());
    const cell = document.querySelector(`.grid-cell[data-index="${state.agentPosition}"]`);
    if (cell) cell.insertAdjacentHTML("beforeend", '<span class="grid-agent"></span>');
  }

  async function runAgent() {
    if (state.agentRunning) return;
    state.agentRunning = true;
    resetAgent(false);
    const route = [0,1,2,7,8,9,14,19,24];
    let reward = 0;
    document.getElementById("runAgent").disabled = true;
    for (let index = 1; index < route.length; index++) {
      await wait(330);
      state.agentPosition = route[index];
      reward -= .1;
      renderAgent();
      document.getElementById("agentSteps").textContent = index;
      document.getElementById("agentReward").textContent = reward.toFixed(1);
    }
    reward += 10;
    document.getElementById("agentReward").textContent = reward.toFixed(1);
    showToast("智能体到达目标！奖励帮助它记住好路线");
    document.getElementById("runAgent").disabled = false;
    state.agentRunning = false;
  }

  function resetAgent(stopRun = true) {
    if (stopRun && state.agentRunning) return;
    state.agentPosition = 0;
    document.getElementById("agentSteps").textContent = "0";
    document.getElementById("agentReward").textContent = "0";
    renderAgent();
  }

  function setupNavigation() {
    const links = document.querySelectorAll(".nav-item");
    links.forEach((link) => link.addEventListener("click", () => closeMobileMenu()));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => link.classList.toggle("active", link.dataset.section === visible.target.id));
    }, { rootMargin: "-25% 0px -60%", threshold: [0, .2, .5] });
    document.querySelectorAll(".page-section").forEach((section) => observer.observe(section));
  }

  function setupGlobalControls() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("mobileOverlay");
    document.getElementById("menuButton").addEventListener("click", () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("show");
    });
    document.getElementById("sidebarClose").addEventListener("click", closeMobileMenu);
    overlay.addEventListener("click", closeMobileMenu);
    document.getElementById("themeToggle").addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(themeKey, document.body.classList.contains("dark") ? "dark" : "light");
      updateThemeButton();
      drawRegression();
    });
    document.getElementById("resetProgress").addEventListener("click", () => {
      if (!window.confirm("确定要清除全部学习进度吗？此操作无法撤销。")) return;
      state.completed.clear();
      saveProgress();
      renderCurriculum();
      renderRoadmap();
      updateProgress();
      showToast("学习进度已重置");
    });
    document.querySelectorAll(".map-node").forEach((node, index) => {
      const filters = ["foundation", "ml", "dl", "rl", "all"];
      node.addEventListener("click", () => jumpToStage(filters[index]));
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter") jumpToStage(filters[index]);
      });
    });
  }

  function jumpToStage(stage) {
    state.currentFilter = stage;
    syncFilters();
    renderCurriculum();
    document.getElementById("curriculum").scrollIntoView({behavior:"smooth"});
  }

  function closeMobileMenu() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("mobileOverlay").classList.remove("show");
  }

  function applySavedTheme() {
    const saved = localStorage.getItem(themeKey);
    if (saved === "dark") document.body.classList.add("dark");
    updateThemeButton();
  }

  function updateThemeButton() {
    const dark = document.body.classList.contains("dark");
    const button = document.getElementById("themeToggle");
    button.textContent = dark ? "☀" : "☾";
    button.setAttribute("aria-label", dark ? "切换浅色主题" : "切换深色主题");
  }

  function updateStreak() {
    const today = new Date().toISOString().slice(0,10);
    const streakKey = "zhijing-ai-streak";
    let streak = { date: today, days: 1 };
    try {
      const saved = JSON.parse(localStorage.getItem(streakKey));
      if (saved && saved.date) {
        const difference = Math.round((new Date(today) - new Date(saved.date)) / 86400000);
        if (difference === 0) streak = saved;
        else if (difference === 1) streak = { date: today, days: saved.days + 1 };
      }
    } catch (_) {}
    localStorage.setItem(streakKey, JSON.stringify(streak));
    document.getElementById("streakDays").textContent = streak.days;
  }

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return new Set(Array.isArray(saved) ? saved : []);
    } catch (_) {
      return new Set();
    }
  }

  function saveProgress() {
    localStorage.setItem(storageKey, JSON.stringify([...state.completed]));
  }

  function getDifficulty(stage) {
    return { foundation: "基础", ml: "核心", dl: "进阶", rl: "进阶" }[stage];
  }

  function estimateDuration(topic) {
    if (topic.length <= 6) return "25 分钟";
    if (topic.length <= 12) return "35 分钟";
    return "45 分钟";
  }

  function highlightText(text, query) {
    const safe = escapeHtml(text);
    const safeQuery = escapeRegExp(escapeHtml(query.trim()));
    return safe.replace(new RegExp(`(${safeQuery})`, "ig"), "<mark>$1</mark>");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[character]));
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => dom.toast.classList.remove("show"), 2300);
  }

  function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  function debounce(callback, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
  }
})();
