window.stageMeta = {
  foundation: {
    order: 1,
    short: "基础",
    name: "编程与数学基础",
    subtitle: "准备共同语言与工具",
    duration: "4 周",
    color: "#f06f55",
    className: "foundation"
  },
  ml: {
    order: 2,
    short: "机器学习",
    name: "机器学习",
    subtitle: "建立数据建模思维",
    duration: "6 周",
    color: "#3c7cc9",
    className: "ml"
  },
  dl: {
    order: 3,
    short: "深度学习",
    name: "深度学习",
    subtitle: "理解并训练神经网络",
    duration: "9 周",
    color: "#7c62bd",
    className: "dl"
  },
  rl: {
    order: 4,
    short: "强化学习",
    name: "强化学习",
    subtitle: "让智能体学会决策",
    duration: "5 周+",
    color: "#2c9876",
    className: "rl"
  }
};

window.curriculumData = [
  {
    id: "F1", stage: "foundation", title: "Python 编程基础", duration: "5 天",
    description: "建立写程序和阅读代码的基本能力。",
    focus: "用数据结构保存信息，用控制流组织逻辑，用函数封装可复用步骤。",
    practice: "完成学生成绩统计器，并能读取文本文件生成词频表。",
    topics: ["变量与基本数据类型", "条件判断与循环", "列表、元组、字典与集合", "函数与作用域", "文件读写与异常处理", "类与对象基础"]
  },
  {
    id: "F2", stage: "foundation", title: "NumPy 与 Pandas", duration: "5 天",
    description: "掌握机器学习最常用的数据计算与处理工具。",
    focus: "数组负责高效数值计算，DataFrame 负责有标签的表格数据分析。",
    practice: "读取一份销售 CSV，完成清洗、分组统计与结果导出。",
    topics: ["NumPy 数组与形状", "索引、切片与广播", "向量化计算", "Pandas Series 与 DataFrame", "数据筛选、排序与分组", "合并、透视与缺失值处理"]
  },
  {
    id: "F3", stage: "foundation", title: "数据可视化与开发工具", duration: "4 天",
    description: "用图形发现数据规律，并建立可重复的实验环境。",
    focus: "图表用于表达数据关系，虚拟环境与版本控制用于保证实验可复现。",
    practice: "创建一份包含分布、趋势、相关性和异常值分析的数据报告。",
    topics: ["Matplotlib 基础", "Seaborn 统计图表", "分布、相关性与异常值可视化", "Jupyter Notebook", "虚拟环境与依赖管理", "Git 与实验记录"]
  },
  {
    id: "F4", stage: "foundation", title: "线性代数", duration: "5 天",
    description: "理解数据、参数与神经网络在计算机中的数学表示。",
    focus: "一个样本可以表示为向量，一批样本可以表示为矩阵，模型计算通常就是矩阵变换。",
    practice: "使用 NumPy 实现向量点积、矩阵乘法和一个简单的线性变换。",
    topics: ["标量、向量与矩阵", "向量长度、距离与夹角", "点积与矩阵乘法", "转置、逆矩阵与秩", "特征值与特征向量", "矩阵分解基础"]
  },
  {
    id: "F5", stage: "foundation", title: "微积分、概率与统计", duration: "1 周",
    description: "掌握理解模型训练、概率预测与数据波动所需的数学直觉。",
    focus: "导数描述变化，概率描述不确定性，统计量帮助从样本推断总体。",
    practice: "手算简单导数和条件概率，并用代码验证均值、方差与常见分布。",
    topics: ["函数、极限与导数", "偏导数、梯度与链式法则", "梯度下降", "随机变量与概率分布", "条件概率与贝叶斯公式", "期望、方差与协方差", "最大似然估计", "抽样、置信区间与假设检验"]
  },

  {
    id: "M1", stage: "ml", title: "机器学习核心概念", duration: "4 天",
    description: "建立完整的建模流程和正确的实验观念。",
    focus: "模型不是记住训练数据，而是从数据中学习能推广到新样本的规律。",
    practice: "选择一个生活问题，写出样本、特征、标签和评价指标。",
    topics: ["机器学习与传统编程", "样本、特征与标签", "监督、无监督与半监督学习", "回归、分类与聚类", "训练集、验证集与测试集", "参数与超参数", "过拟合与欠拟合", "偏差与方差", "数据泄漏与泛化能力"]
  },
  {
    id: "M2", stage: "ml", title: "数据预处理", duration: "5 天",
    description: "把原始数据转换成模型能够稳定学习的形式。",
    focus: "高质量输入决定模型上限，所有预处理都必须只从训练数据学习参数。",
    practice: "构建一条同时处理数值和类别特征的 Scikit-learn Pipeline。",
    topics: ["数据质量检查", "缺失值处理", "重复值与异常值", "类别特征编码", "标准化与归一化", "数据集划分", "类别不平衡处理", "数据增强基础"]
  },
  {
    id: "M3", stage: "ml", title: "回归模型", duration: "1 周",
    description: "学习预测房价、销量等连续数值。",
    focus: "回归模型寻找输入特征与连续目标之间的函数关系。",
    practice: "完成加州房价预测，比较线性模型与树模型的效果。",
    topics: ["一元与多元线性回归", "最小二乘法", "多项式回归", "Ridge 岭回归", "Lasso 回归", "回归树与随机森林回归", "MAE、MSE、RMSE 与 R²"]
  },
  {
    id: "M4", stage: "ml", title: "分类模型", duration: "2 周",
    description: "学习判断类别、风险或事件是否发生。",
    focus: "分类模型通常输出类别概率，再根据阈值转化为最终类别。",
    practice: "完成垃圾邮件或泰坦尼克号分类，解释混淆矩阵。",
    topics: ["逻辑回归", "K 近邻 KNN", "朴素贝叶斯", "决策树", "随机森林", "支持向量机 SVM", "多分类策略", "概率校准与分类阈值"]
  },
  {
    id: "M5", stage: "ml", title: "无监督学习", duration: "1 周",
    description: "在没有标签的数据中发现结构、群组和异常。",
    focus: "无监督学习没有标准答案，需要结合内部指标和业务解释共同判断结果。",
    practice: "对客户消费数据聚类，并使用 PCA 展示不同客户群。",
    topics: ["K-Means 聚类", "层次聚类", "DBSCAN", "聚类效果评估", "PCA 主成分分析", "t-SNE 与 UMAP", "异常检测"]
  },
  {
    id: "M6", stage: "ml", title: "模型评估与选择", duration: "5 天",
    description: "选择真正适合任务的指标，并得到可信的实验结论。",
    focus: "指标必须与问题成本一致，测试集只应用于最终的一次客观评估。",
    practice: "为不平衡分类任务比较 Accuracy、F1 和 ROC-AUC 的差异。",
    topics: ["混淆矩阵", "准确率、精确率与召回率", "F1-score", "ROC 曲线与 AUC", "PR 曲线", "交叉验证", "学习曲线", "基线模型与误差分析"]
  },
  {
    id: "M7", stage: "ml", title: "特征工程与模型调优", duration: "5 天",
    description: "通过更好的表示和参数设置提升模型。",
    focus: "特征工程向模型提供有用表达，调参则在验证机制下寻找更合适的模型配置。",
    practice: "使用 Pipeline、交叉验证和参数搜索完成一次规范调优。",
    topics: ["特征构造", "特征选择", "降维与特征压缩", "正则化", "网格搜索", "随机搜索与贝叶斯优化", "Scikit-learn Pipeline", "模型解释与特征重要性"]
  },
  {
    id: "M8", stage: "ml", title: "集成学习", duration: "5 天",
    description: "组合多个模型，获得更稳定、更强的预测能力。",
    focus: "Bagging 主要降低方差，Boosting 让后续模型持续修正之前的错误。",
    practice: "比较随机森林、Gradient Boosting 和 XGBoost 的训练结果。",
    topics: ["Bagging 思想", "Boosting 思想", "随机森林进阶", "AdaBoost", "Gradient Boosting", "XGBoost", "LightGBM 与 CatBoost", "Voting 与 Stacking"]
  },

  {
    id: "D1", stage: "dl", title: "神经网络基础", duration: "1 周",
    description: "从一个神经元开始理解神经网络的计算过程。",
    focus: "神经网络是可微分函数的层层组合，通过数据学习大量权重参数。",
    practice: "用 NumPy 实现两层神经网络的前向计算。",
    topics: ["感知机与人工神经元", "权重、偏置与全连接层", "前向传播", "计算图", "反向传播", "通用逼近直觉", "多层感知机 MLP"]
  },
  {
    id: "D2", stage: "dl", title: "训练神经网络", duration: "1 周",
    description: "理解损失、梯度、优化器和稳定训练策略。",
    focus: "训练就是根据损失对参数的梯度，反复小步更新模型参数。",
    practice: "观察不同学习率、激活函数和优化器对训练曲线的影响。",
    topics: ["Sigmoid、Tanh 与 ReLU", "GELU 与 Softmax", "均方误差与交叉熵", "SGD 与 Momentum", "Adam 与 AdamW", "权重初始化", "Batch Normalization 与 Layer Normalization", "Dropout 与 Early Stopping", "学习率调度与梯度裁剪"]
  },
  {
    id: "D3", stage: "dl", title: "PyTorch 实践", duration: "1 周",
    description: "掌握搭建、训练、验证和保存神经网络的标准代码结构。",
    focus: "Tensor 承载数据，自动微分计算梯度，Module 组织模型，DataLoader 提供批次。",
    practice: "使用 PyTorch 完成 MNIST 手写数字分类。",
    topics: ["Tensor 张量", "Autograd 自动微分", "Dataset 与 DataLoader", "nn.Module 自定义模型", "训练循环与验证循环", "GPU 与 CUDA", "模型保存、加载与实验记录"]
  },
  {
    id: "D4", stage: "dl", title: "卷积神经网络 CNN", duration: "2 周",
    description: "学习神经网络如何提取图像中的局部与层次特征。",
    focus: "卷积通过共享的小型卷积核扫描图像，在保留空间结构的同时提取特征。",
    practice: "完成 CIFAR-10 分类，并用预训练 ResNet 做迁移学习。",
    topics: ["卷积核与特征图", "步长、填充与输出尺寸", "池化与感受野", "经典 CNN 结构", "ResNet 与残差连接", "图像数据增强", "迁移学习与微调", "目标检测基础", "图像分割基础", "Vision Transformer"]
  },
  {
    id: "D5", stage: "dl", title: "序列模型", duration: "1 周",
    description: "处理文本、语音和时间序列等有顺序的数据。",
    focus: "序列模型在处理当前输入时保留历史信息，用隐藏状态表达上下文。",
    practice: "使用 LSTM 完成电影评论情感分类。",
    topics: ["序列数据与时间依赖", "循环神经网络 RNN", "梯度消失与梯度爆炸", "LSTM", "GRU", "双向循环网络", "Seq2Seq 与 Encoder-Decoder"]
  },
  {
    id: "D6", stage: "dl", title: "Attention 与 Transformer", duration: "2 周",
    description: "理解现代语言模型和多模态模型的核心架构。",
    focus: "自注意力让每个位置直接聚合序列中其他位置的信息，并行建立全局关系。",
    practice: "手算一次注意力，并使用 Transformer 完成文本分类。",
    topics: ["注意力机制直觉", "Query、Key 与 Value", "缩放点积注意力", "自注意力", "多头注意力", "位置编码", "Mask 机制", "Transformer Encoder", "Transformer Decoder", "BERT、GPT 与 T5"]
  },
  {
    id: "D7", stage: "dl", title: "大语言模型应用", duration: "1 周",
    description: "掌握预训练模型的基本使用、适配与知识增强方法。",
    focus: "大模型先从海量数据学习通用表示，再通过提示、检索或微调适配具体任务。",
    practice: "使用预训练模型完成分类，并搭建一个小型 RAG 问答流程。",
    topics: ["Token 与 Tokenizer", "预训练与指令微调", "Prompt 基础", "LoRA 与 PEFT", "Embedding 向量表示", "向量检索与 RAG", "模型量化", "大模型评估", "幻觉、偏见与安全"]
  },
  {
    id: "D8", stage: "dl", title: "生成模型与多模态", duration: "1 周",
    description: "了解模型如何生成图像、文本等新内容。",
    focus: "生成模型学习数据分布，从分布中采样或逐步还原出新的内容。",
    practice: "训练一个小型自编码器，并比较 VAE、GAN 和扩散模型的思想。",
    topics: ["自编码器 Autoencoder", "变分自编码器 VAE", "生成对抗网络 GAN", "扩散模型", "对比学习", "多模态表示与视觉语言模型"]
  },

  {
    id: "R1", stage: "rl", title: "强化学习核心概念", duration: "4 天",
    description: "建立智能体、环境、奖励和策略之间的完整认知。",
    focus: "强化学习不是根据标准答案学习，而是通过行动得到奖励，优化长期累计回报。",
    practice: "为迷宫、推荐系统或机器人任务定义状态、动作和奖励。",
    topics: ["智能体与环境", "状态、动作与奖励", "策略 Policy", "轨迹、回报与回合", "折扣因子", "状态价值与动作价值", "探索与利用", "On-policy 与 Off-policy"]
  },
  {
    id: "R2", stage: "rl", title: "马尔可夫决策过程 MDP", duration: "5 天",
    description: "掌握强化学习最重要的数学建模框架。",
    focus: "MDP 假设当前状态包含预测未来所需的信息，用状态转移、奖励和策略描述决策过程。",
    practice: "把一个网格世界写成有限 MDP，并计算简单策略的价值。",
    topics: ["马尔可夫性质", "状态转移概率", "奖励函数", "策略与状态分布", "贝尔曼期望方程", "贝尔曼最优方程", "最优价值与最优策略"]
  },
  {
    id: "R3", stage: "rl", title: "多臂老虎机与动态规划", duration: "1 周",
    description: "理解探索策略，以及已知环境模型时的规划方法。",
    focus: "老虎机揭示探索与利用矛盾；动态规划通过反复备份价值求解已知 MDP。",
    practice: "实现 ε-Greedy 多臂老虎机与网格世界价值迭代。",
    topics: ["多臂老虎机", "贪心与 ε-Greedy", "UCB 上置信界", "Thompson Sampling", "策略评估", "策略迭代", "价值迭代"]
  },
  {
    id: "R4", stage: "rl", title: "蒙特卡洛与时序差分", duration: "1 周",
    description: "在不知道环境模型的情况下，从真实交互经验学习价值。",
    focus: "蒙特卡洛等待回合结束，TD 方法则用下一状态估计值进行自举更新。",
    practice: "比较 MC 与 TD(0) 在同一个随机行走环境中的学习速度。",
    topics: ["蒙特卡洛预测", "首次访问与每次访问 MC", "蒙特卡洛控制", "TD Learning", "TD Error 与自举", "n-step Return", "资格迹 TD(λ)"]
  },
  {
    id: "R5", stage: "rl", title: "表格型控制算法", duration: "5 天",
    description: "学习强化学习中最经典的两个无模型控制算法。",
    focus: "SARSA 学习当前行为策略的价值，Q-Learning 学习贪心目标策略的价值。",
    practice: "使用 SARSA 和 Q-Learning 分别解决 CliffWalking 与 FrozenLake。",
    topics: ["SARSA", "Q-Learning", "Expected SARSA", "Double Q-Learning", "奖励塑形与稀疏奖励"]
  },
  {
    id: "R6", stage: "rl", title: "DQN 与价值型深度强化学习", duration: "1 周",
    description: "用神经网络近似大规模状态空间中的动作价值。",
    focus: "DQN 使用经验回放打散相关样本，用目标网络降低训练目标的快速漂移。",
    practice: "使用 PyTorch 或 Stable-Baselines3 训练 CartPole 智能体。",
    topics: ["函数近似", "Deep Q-Network", "经验回放", "目标网络", "Double DQN", "Dueling DQN", "优先经验回放"]
  },
  {
    id: "R7", stage: "rl", title: "策略梯度与 Actor-Critic", duration: "1 周",
    description: "直接学习策略，并用价值函数帮助降低更新方差。",
    focus: "Actor 决定如何行动，Critic 评价行动好坏，二者通过 Advantage 信号协同学习。",
    practice: "实现 REINFORCE，再使用 A2C 解决 CartPole。",
    topics: ["参数化策略", "策略梯度定理", "REINFORCE", "基线与方差降低", "Advantage 优势函数", "Actor-Critic", "A2C 与 A3C"]
  },
  {
    id: "R8", stage: "rl", title: "PPO 与连续动作控制", duration: "1 周",
    description: "掌握当前实践中常见且稳定的策略优化算法。",
    focus: "PPO 限制每次策略更新幅度；DDPG、TD3 和 SAC 面向连续动作空间。",
    practice: "使用 PPO 解决 LunarLander，使用 SAC 解决 Pendulum。",
    topics: ["PPO", "策略裁剪与重要性采样", "连续动作空间", "DDPG", "TD3", "最大熵强化学习", "SAC"]
  },
  {
    id: "R9", stage: "rl", title: "强化学习进阶", duration: "持续学习",
    description: "了解真实任务中更复杂的强化学习方向。",
    focus: "进阶强化学习围绕样本效率、安全、泛化、多人协作和人类偏好等问题展开。",
    practice: "选择一个方向阅读论文，复现基线并记录实验假设与结果。",
    topics: ["基于模型的强化学习", "模仿学习", "逆强化学习", "离线强化学习", "多智能体强化学习", "分层强化学习", "元强化学习", "安全强化学习", "RLHF 与人类偏好"]
  }
];

window.lessonDetails = {
  "梯度下降": {
    summary: "梯度下降是一种沿着损失函数下降最快方向，迭代寻找较优参数的方法。",
    concept: "梯度告诉我们参数增大时损失上升最快的方向，因此沿负梯度方向更新参数。学习率决定每一步走多远。",
    objectives: ["理解损失曲面和梯度的关系", "写出基本参数更新公式", "判断学习率过大或过小的表现"],
    practice: "用 NumPy 拟合 y = 2x + 1，绘制每轮训练的损失曲线。"
  },
  "过拟合与欠拟合": {
    summary: "过拟合表示模型记住了训练数据的细节，欠拟合表示模型连基本规律也没有学到。",
    concept: "比较训练误差和验证误差：两者都高通常是欠拟合；训练误差低但验证误差明显更高通常是过拟合。",
    objectives: ["识别训练曲线中的过拟合", "理解模型复杂度与泛化的关系", "列出正则化、数据增强等常见对策"],
    practice: "在同一数据集上比较不同深度的决策树，并绘制训练分数与验证分数。"
  },
  "一元与多元线性回归": {
    summary: "线性回归用特征的加权和预测连续数值，是理解损失和优化的起点。",
    concept: "模型形式为 y = Wx + b。训练目标通常是让预测值与真实值之间的平方误差最小。",
    objectives: ["理解系数和截距的含义", "使用 Scikit-learn 训练回归模型", "使用残差与 R² 分析效果"],
    practice: "使用面积、房龄等特征预测房价，并解释各特征系数。"
  },
  "逻辑回归": {
    summary: "逻辑回归是经典线性分类器，通过 Sigmoid 把线性输出转换为概率。",
    concept: "先计算特征加权和，再映射到 0～1。分类阈值不一定必须是 0.5，应由业务成本决定。",
    objectives: ["理解概率输出和决策边界", "掌握二元交叉熵", "调整阈值并观察精确率与召回率"],
    practice: "建立客户流失分类器，并比较 0.3、0.5、0.7 三种阈值。"
  },
  "决策树": {
    summary: "决策树通过连续提出特征判断，把样本划分到越来越纯的子区域。",
    concept: "每次分裂选择能最大程度降低不纯度的特征与阈值；树过深容易记住训练样本。",
    objectives: ["理解基尼不纯度和信息增益", "解释一次树节点分裂", "通过限制深度控制过拟合"],
    practice: "训练并可视化一棵三层决策树，用自然语言解释一条预测路径。"
  },
  "K-Means 聚类": {
    summary: "K-Means 通过反复分配样本和更新中心，把数据划分为 K 个紧凑群组。",
    concept: "算法最小化样本到所属中心的平方距离，对数据尺度、初始中心和异常值较敏感。",
    objectives: ["描述分配和更新两个步骤", "使用肘部法与轮廓系数选择 K", "解释标准化对结果的影响"],
    practice: "根据消费金额和频率划分客户群，并为每个群组写出画像。"
  },
  "PCA 主成分分析": {
    summary: "PCA 寻找数据中方差最大的正交方向，用较少维度保留主要信息。",
    concept: "主成分是原特征的线性组合。降维会损失部分信息，但能压缩、去噪和帮助可视化。",
    objectives: ["理解主成分和解释方差", "选择合适的保留维数", "避免在划分数据前拟合 PCA"],
    practice: "把手写数字数据降到二维并可视化，再比较降维前后的分类效果。"
  },
  "反向传播": {
    summary: "反向传播利用链式法则，从输出层向输入层高效计算每个参数的梯度。",
    concept: "前向传播保存中间结果，反向传播把损失对后续节点的影响逐层传回参数。",
    objectives: ["理解局部梯度如何相乘", "画出简单计算图", "解释自动微分为训练提供了什么"],
    practice: "手算 y = (wx + b)² 对 w 和 b 的梯度，再用 PyTorch 验证。"
  },
  "卷积核与特征图": {
    summary: "卷积核在图像局部区域上共享参数，逐步提取边缘、纹理和高级语义。",
    concept: "同一个小矩阵滑过整张图像，每个位置输出一次加权和，因此参数少且保留空间关系。",
    objectives: ["手算一次二维卷积", "理解通道与特征图", "说明参数共享的意义"],
    practice: "用不同卷积核处理一张灰度图，观察锐化、模糊和边缘检测效果。"
  },
  "LSTM": {
    summary: "LSTM 通过门控结构控制信息的保留、遗忘和输出，缓解普通 RNN 的长期依赖问题。",
    concept: "细胞状态提供较稳定的信息通道，遗忘门、输入门和输出门决定信息流动。",
    objectives: ["理解三种门的作用", "区分隐藏状态与细胞状态", "使用 LSTM 处理文本或时间序列"],
    practice: "训练 LSTM 对电影评论进行正负面分类，并观察不同序列长度的影响。"
  },
  "Query、Key 与 Value": {
    summary: "Q、K、V 把注意力过程拆成“我要找什么、我拥有什么、我要取出什么”。",
    concept: "Query 与 Key 的相似度决定关注权重，再用这些权重对 Value 做加权求和。",
    objectives: ["说明 Q、K、V 的直觉含义", "计算简单注意力权重", "理解缩放与 Softmax 的作用"],
    practice: "用三组二维向量手算注意力分数、Softmax 权重和最终输出。"
  },
  "Transformer Encoder": {
    summary: "Transformer Encoder 由多头自注意力和前馈网络堆叠而成，用于生成上下文表示。",
    concept: "残差连接保持信息流，LayerNorm 稳定训练，自注意力混合位置间信息，前馈层逐位置变换。",
    objectives: ["画出 Encoder 层结构", "解释残差连接与 LayerNorm", "说明 BERT 如何使用 Encoder"],
    practice: "用 PyTorch 组装一个 EncoderLayer，并检查输入输出张量形状。"
  },
  "向量检索与 RAG": {
    summary: "RAG 先检索外部知识，再把相关内容交给大模型生成答案。",
    concept: "文档和问题被编码为向量，通过相似度检索相关片段，从而提供更新、更可追溯的上下文。",
    objectives: ["理解切分、向量化、检索与生成流程", "选择基本相似度指标", "认识召回质量对答案的影响"],
    practice: "把自己的学习笔记做成小型知识库，实现带来源片段的问答。"
  },
  "贝尔曼最优方程": {
    summary: "贝尔曼最优方程把最优价值写成当前奖励与下一状态最优价值的递归关系。",
    concept: "一个状态的最优价值等于所有可选动作中，期望即时奖励加折扣后续最优价值的最大值。",
    objectives: ["区分贝尔曼期望方程与最优方程", "理解价值备份", "在小型 MDP 中计算最优价值"],
    practice: "为 3×3 网格世界写出并迭代贝尔曼最优更新。"
  },
  "Q-Learning": {
    summary: "Q-Learning 是无模型、Off-policy 的时序差分控制算法，直接学习最优动作价值。",
    concept: "更新目标使用下一状态的最大 Q 值，即使当前行为策略仍在探索，也在学习贪心目标策略。",
    objectives: ["写出 Q-Learning 更新公式", "解释 Off-policy", "设置学习率、折扣因子与探索率"],
    practice: "从零实现 FrozenLake 的 Q 表训练，并画出每 100 回合成功率。"
  },
  "Deep Q-Network": {
    summary: "DQN 用神经网络近似 Q 函数，使价值学习能够处理图像等高维状态。",
    concept: "经验回放降低样本相关性，目标网络提供相对稳定的学习目标，两者是 DQN 稳定训练的关键。",
    objectives: ["理解 DQN 输入和输出", "实现经验回放缓冲区", "说明在线网络和目标网络的分工"],
    practice: "训练 CartPole，并绘制回合奖励和训练损失。"
  },
  "Actor-Critic": {
    summary: "Actor-Critic 同时学习策略和价值：Actor 选择动作，Critic 评价动作。",
    concept: "Critic 提供比完整回报方差更低的学习信号，Actor 根据优势方向提高好动作的概率。",
    objectives: ["区分 Actor 与 Critic 的输出", "理解 Advantage 信号", "写出两个网络的损失思路"],
    practice: "为 CartPole 实现简化 Actor-Critic，分别记录策略损失和价值损失。"
  },
  "PPO": {
    summary: "PPO 通过裁剪新旧策略概率比，限制单次策略更新幅度，兼顾稳定性和实现难度。",
    concept: "如果新策略偏离旧策略过多，裁剪目标会阻止继续从这次变化中获益。",
    objectives: ["理解重要性采样概率比", "解释裁剪目标", "识别 PPO 常见超参数"],
    practice: "使用 Stable-Baselines3 训练 LunarLander，并比较两个 clip_range。"
  },
  "SAC": {
    summary: "SAC 是面向连续动作的 Off-policy Actor-Critic 算法，同时最大化回报与策略熵。",
    concept: "熵奖励鼓励策略保留随机性和探索能力，经验回放则提高数据复用效率。",
    objectives: ["理解最大熵目标", "说明 SAC 为什么适合连续控制", "区分 SAC 与 PPO 的数据使用方式"],
    practice: "使用 SAC 训练 Pendulum，观察温度参数和探索行为。"
  }
};

window.projectData = [
  { title: "销售数据探索", stage: "foundation", icon: "▥", difficulty: "入门", description: "清洗真实 CSV，完成统计分析并用图表表达结论。", skills: ["Pandas", "可视化", "数据清洗"] },
  { title: "加州房价预测", stage: "ml", icon: "⌂", difficulty: "入门", description: "建立完整回归流程，比较线性模型与树模型。", skills: ["回归", "特征工程", "RMSE"] },
  { title: "垃圾邮件识别", stage: "ml", icon: "✉", difficulty: "入门", description: "将文本转换为特征并训练二分类模型。", skills: ["分类", "文本特征", "F1"] },
  { title: "客户群体画像", stage: "ml", icon: "◌", difficulty: "进阶", description: "通过聚类识别客户群，并解释不同群体特点。", skills: ["K-Means", "PCA", "业务解释"] },
  { title: "手写数字分类", stage: "dl", icon: "✎", difficulty: "入门", description: "使用 PyTorch 训练第一个全连接神经网络。", skills: ["PyTorch", "MLP", "训练循环"] },
  { title: "猫狗图像分类", stage: "dl", icon: "▧", difficulty: "进阶", description: "使用 CNN 和迁移学习完成图像分类。", skills: ["CNN", "数据增强", "迁移学习"] },
  { title: "评论情感分析", stage: "dl", icon: "◒", difficulty: "进阶", description: "使用 LSTM 或 Transformer 判断评论情感。", skills: ["NLP", "LSTM", "Transformer"] },
  { title: "学习笔记 RAG", stage: "dl", icon: "⌕", difficulty: "进阶", description: "让模型根据自己的学习笔记回答问题并返回依据。", skills: ["Embedding", "检索", "RAG"] },
  { title: "FrozenLake 智能体", stage: "rl", icon: "❄", difficulty: "入门", description: "从零实现 Q-Learning 并分析探索率。", skills: ["Q 表", "ε-Greedy", "TD"] },
  { title: "CartPole 平衡杆", stage: "rl", icon: "⌁", difficulty: "进阶", description: "训练 DQN 智能体自主保持杆子平衡。", skills: ["DQN", "经验回放", "目标网络"] },
  { title: "LunarLander 着陆", stage: "rl", icon: "△", difficulty: "进阶", description: "使用 PPO 让飞行器学会稳定着陆。", skills: ["PPO", "策略优化", "奖励设计"] },
  { title: "自定义决策环境", stage: "rl", icon: "⌘", difficulty: "挑战", description: "创建 Gymnasium 环境并训练、评估一个智能体。", skills: ["环境设计", "评估", "综合实践"] }
];
