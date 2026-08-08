(function () {
  "use strict";

  const lessons = window.theoryLessons || (window.theoryLessons = {});
  const concepts = window.algorithmConcepts || {};
  const details = window.lessonDetails || {};
  const modules = window.curriculumData || [];

  const moduleFlows = {
    F1: ["明确要保存或处理的信息", "写出最小可运行结构", "跟踪程序状态如何变化", "检查边界情况与错误"],
    F2: ["确认数据的行列与类型", "选择对应的数据操作", "观察变换后的形状和内容", "核对结果并避免隐式错误"],
    F3: ["明确图表或实验要回答的问题", "准备可复现的数据与环境", "生成结果并检查表达是否准确", "保存证据并记录结论"],
    F4: ["把对象写成向量或矩阵", "确认维度与运算规则", "完成几何或代数变换", "解释结果在数据中的含义"],
    F5: ["定义随机量或函数关系", "选择对应的计算规则", "逐步代入并得到数值", "解释数值反映的不确定性或变化率"],
    M1: ["把业务问题翻译成学习任务", "明确样本、特征、标签与评价目标", "建立训练和评估边界", "用未见数据检验是否真正学会"],
    M2: ["只用训练数据检查质量", "拟合清洗或变换规则", "以同一规则转换后续数据", "核对分布、形状与泄漏风险"],
    M3: ["确定连续预测目标", "构造能表达关系的回归表示", "根据损失估计模型参数", "在测试数据上解释误差与残差"],
    M4: ["定义类别和错误代价", "把样本转换成可比较的证据", "学习决策边界或类别概率", "按业务阈值评价误报与漏报"],
    M5: ["确认数据没有可直接使用的标签", "定义相似性或低维结构", "发现群组、方向或异常", "检验结构是否稳定且具有业务意义"],
    M6: ["先确定评价问题", "从预测与真实答案计算指标", "比较基线、候选模型和误差类型", "根据证据决定下一轮改进"],
    M7: ["从原始变量提出可验证假设", "仅在训练折中构造和选择特征", "搜索配置并记录验证结果", "在独立测试集做一次最终确认"],
    M8: ["准备多个具有差异的基学习器", "按算法规则训练或串联模型", "聚合各模型的判断", "比较集成收益、复杂度和过拟合风险"],
    D1: ["把一个样本写成张量", "用当前权重完成前向计算", "由损失得到学习信号", "更新参数并观察表示能力"],
    D2: ["检查激活、损失与初始化是否匹配", "完成前向与反向传播", "由优化器更新参数", "监控训练稳定性和验证误差"],
    D3: ["确定张量形状与设备", "组织数据和模型模块", "执行训练与验证循环", "保存能够复现实验的状态"],
    D4: ["把图像组织为批次与通道", "提取局部视觉模式", "逐层扩大感受野并组合特征", "输出任务结果并检查空间信息"],
    D5: ["按时间顺序组织输入", "维护并更新隐藏状态", "把历史信息传到后续时刻", "输出序列判断并检查长期依赖"],
    D6: ["把输入映射为可比较的表示", "计算位置之间的相关权重", "聚合上下文并通过多层变换", "得到带上下文的序列表示"],
    D7: ["明确模型需要完成的语言任务", "把文本转成模型可处理的单元", "注入提示、检索结果或适配参数", "检查答案依据、质量与安全风险"],
    D8: ["定义要学习的数据分布或跨模态关系", "选择潜变量、对抗或去噪目标", "训练生成或对齐模型", "从质量、多样性和风险解释输出"],
    R1: ["明确智能体能观察和控制什么", "定义奖励与回合边界", "按照策略采集交互轨迹", "从回报判断策略是否改善"],
    R2: ["定义状态、动作、转移与奖励", "在给定策略下展开一步未来", "递归汇总长期价值", "比较动作并得到更优策略"],
    R3: ["建立当前价值或信念估计", "依据探索规则选择动作", "观察奖励或完整环境模型", "更新估计并重复决策"],
    R4: ["按照策略收集经验", "构造回报或自举目标", "计算当前估计误差", "用误差更新价值并继续采样"],
    R5: ["读取当前状态的动作价值", "按行为策略选择并执行动作", "构造当前算法特有的 TD 目标", "更新 Q 表并检查探索效果"],
    R6: ["用神经网络近似动作价值", "把交互经验组织成训练样本", "构造相对稳定的 TD 目标", "更新网络并周期性评价策略"],
    R7: ["由参数化策略采样动作", "计算轨迹回报或优势", "估计提高期望回报的梯度", "更新 Actor 并控制估计方差"],
    R8: ["定义连续策略与价值网络", "使用近期轨迹或回放数据", "限制策略更新或稳定价值目标", "评估回报、探索和动作稳定性"],
    R9: ["确认标准强化学习假设哪里不足", "引入模型、示范、约束或任务结构", "按新目标学习策略", "检查分布偏移、安全性与泛化"],
  };

  const modulePrerequisites = {
    F1: ["无需前置知识", "会使用电脑和浏览器"], F2: ["Python 变量与容器", "条件与循环"],
    F3: ["NumPy 与 Pandas", "基础统计描述"], F4: ["基本代数", "坐标系直觉"], F5: ["函数与代数", "向量与矩阵"],
    M1: ["Python 与数据表", "基础概率统计"], M2: ["样本、特征与标签", "训练集与测试集"],
    M3: ["监督学习", "向量与梯度下降"], M4: ["监督学习", "概率与分类指标"],
    M5: ["特征缩放", "距离与矩阵"], M6: ["训练集、验证集与测试集", "基础分类与回归"],
    M7: ["数据预处理", "交叉验证"], M8: ["决策树", "偏差与方差"],
    D1: ["线性代数", "梯度下降"], D2: ["前向传播与反向传播", "损失函数"],
    D3: ["Python 类与函数", "神经网络基础"], D4: ["张量与神经网络", "图像基础"],
    D5: ["反向传播", "序列数据"], D6: ["矩阵乘法", "序列模型"],
    D7: ["Transformer", "文本与向量表示"], D8: ["概率分布", "神经网络训练"],
    R1: ["概率与期望", "机器学习基本概念"], R2: ["强化学习核心概念", "条件概率"],
    R3: ["价值函数", "贝尔曼方程"], R4: ["回报与价值函数", "抽样均值"],
    R5: ["TD Learning", "探索与利用"], R6: ["Q-Learning", "深度神经网络"],
    R7: ["概率分布", "价值函数与梯度"], R8: ["Actor-Critic", "连续概率分布"],
    R9: ["PPO、DQN 或 SAC", "强化学习评估"],
  };

  const sentence = (value) => /[。！？]$/.test(String(value).trim()) ? String(value).trim() : `${String(value).trim()}。`;

  function normalizeExistingStep(item, index, flow) {
    const previous = index === 0 ? flow[0] : `上一步“${flow[index - 1] || "阶段结果"}”得到的信息`;
    const output = flow[index + 1] ? `可用于“${flow[index + 1]}”的阶段结果` : "可以进入评价与实际使用的结果";
    return {
      title: item.title,
      input: item.input || previous,
      action: item.action || item.description,
      why: item.why || "这一步把抽象目标变成可检查的中间结果，便于发现错误发生在哪个环节。",
      output: item.output || output,
      next: item.next || (flow[index + 1] ? `接下来进入“${flow[index + 1]}”。` : "最后用独立数据或任务反馈检验结果。"),
      expression: item.expression,
      note: item.note,
    };
  }

  function buildSteps(module, topic, profile, existing, concept) {
    if (profile.steps && profile.steps.length) return profile.steps;
    const flow = profile.flow || moduleFlows[module.id] || moduleFlows.M1;
    if (existing && existing.steps && existing.steps.length) {
      return existing.steps.map((item, index) => normalizeExistingStep(item, index, flow));
    }
    const vocabulary = concept && concept.core ? concept.core : [];
    return flow.map((title, index) => {
      const term = vocabulary[index % Math.max(vocabulary.length, 1)];
      const termText = term ? `在 ${topic} 中，这一步会用到“${term[0]}”：${term[1]}` : profile.insight;
      return {
        title,
        input: index === 0 ? (concept ? concept.input : profile.input || `围绕“${profile.scene}”整理出的数据与条件`) : `上一步已经得到的“${flow[index - 1]}”结果`,
        action: `${profile.process[index] || profile.process[profile.process.length - 1]} ${termText}`,
        why: profile.reasons[index] || `如果跳过这一步，就无法确认 ${topic} 的中间过程是否符合问题设定。`,
        output: index === flow.length - 1 ? (concept ? concept.output : profile.result) : `一份明确的“${title}”中间结果`,
        next: index === flow.length - 1 ? `用“${profile.result}”回到最初场景，判断方法是否真正解决问题。` : `这个结果将作为下一步“${flow[index + 1]}”的输入。`,
      };
    });
  }

  function buildChecks(topic, profile, concept, existing) {
    if (profile.checks) return profile.checks;
    if (existing && existing.checks && existing.checks.length >= 2) return existing.checks;
    return [
      [`在“${profile.scene}”中，${topic} 真正接收的输入和要产生的输出分别是什么？`, concept ? `输入是${concept.input}输出是${concept.output}` : `输入来自场景中的数据与条件，输出应当能够解释或得到“${profile.result}”。`],
      [`如果观察到“${profile.counterfactual}”，你会继续使用 ${topic} 吗？`, `不能机械继续。应先检查适用前提与中间结果，再依据“${profile.boundary}”决定调整方法或更换方案。`],
    ];
  }

  function buildLesson(module, topic, profile) {
    const existing = lessons[topic];
    const concept = concepts[topic];
    const detail = details[topic];
    const formalDefinition = profile.definition || (concept && concept.definition) || (detail && detail.summary) || `${topic}是在“${module.title}”中用来组织信息、完成计算或支持判断的一项基础方法。`;
    const terms = concept && concept.core ? concept.core : profile.terms || [];
    const flow = profile.flow || moduleFlows[module.id] || moduleFlows.M1;
    const steps = buildSteps(module, topic, profile, existing, concept);
    const worked = profile.workedExample || (existing && existing.example) || {
      title: profile.exampleTitle || `沿着“${profile.scene}”完整走一遍`,
      description: profile.example,
      calculations: [
        `起点：${profile.scene}`,
        `观察：${profile.observation}`,
        `处理：${profile.process.join("；")}`,
        `结果：${profile.result}`,
        `解释：${profile.takeaway}`,
      ],
    };
    return {
      readTime: existing && existing.readTime ? Math.max(existing.readTime, concept ? 20 : 12) : (concept ? 22 : 12),
      prerequisites: (existing && existing.prerequisites) || profile.prerequisites || modulePrerequisites[module.id] || [],
      objectives: (existing && existing.objectives) || [
        `能从实际问题中识别什么时候需要 ${topic}`,
        `能按顺序解释 ${topic} 的输入、处理过程和输出`,
        `能用一个新例子判断 ${topic} 的适用边界`,
      ],
      summary: sentence(profile.takeaway),
      scenario: {
        title: profile.scene,
        paragraphs: [profile.story, profile.observation],
        question: profile.question,
      },
      narrative: [
        profile.bridge,
        `${profile.example} 在这个过程中，${terms.slice(0, 3).map(([term, meaning]) => `“${term}”指${String(meaning).replace(/[。；;，,]+$/, "")}`).join("；") || profile.insight}。`,
        profile.insight,
      ],
      formalDefinition,
      vocabulary: terms,
      distinction: (concept && concept.distinction) || profile.boundary,
      steps,
      formulas: (existing && existing.formulas) || profile.formulas || [],
      visualAid: profile.visualAid || { type: "flow", items: [profile.scene, flow[0], flow[1], flow[2], profile.result] },
      workedExample: worked,
      pseudocode: (existing && existing.pseudocode) || profile.pseudocode || flow.map((item, index) => `${index + 1}. ${item}`),
      comparison: profile.comparison || [
        { title: `适合使用 ${topic}`, text: profile.suitable },
        { title: "需要停下来检查", text: profile.boundary },
      ],
      strengths: (existing && existing.strengths) || [profile.suitable],
      limitations: (existing && existing.limitations) || [profile.boundary],
      pitfalls: (existing && existing.pitfalls) || [profile.counterfactual, `只记住“${formalDefinition}”，却不能用场景解释其输入和输出。`],
      checks: buildChecks(topic, profile, concept, existing),
      practice: profile.practice || (detail && detail.practice) || module.practice,
      authored: true,
      stage: module.stage,
      moduleId: module.id,
    };
  }

  window.registerNarrativeStage = function registerNarrativeStage(stage, profiles) {
    const stageModules = modules.filter((module) => module.stage === stage);
    stageModules.forEach((module) => {
      module.topics.forEach((topic) => {
        const profile = profiles[topic];
        if (!profile) throw new Error(`[课程内容缺失] ${module.id} ${topic}`);
        lessons[topic] = buildLesson(module, topic, profile);
      });
    });
  };

  window.createLessonProfile = function createLessonProfile(config) {
    const required = ["scene", "story", "observation", "question", "bridge", "example", "insight", "process", "reasons", "result", "takeaway", "suitable", "boundary", "counterfactual"];
    required.forEach((field) => {
      if (!config[field] || (Array.isArray(config[field]) && !config[field].length)) throw new Error(`[课程字段缺失] ${field}`);
    });
    return config;
  };
})();
