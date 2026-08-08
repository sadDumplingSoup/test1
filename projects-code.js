(function () {
  "use strict";

  const projects = {};

  projects["销售数据探索"] = {
    filename: "sales_analysis.py",
    runtime: "约 10 秒",
    goal: "使用 Pandas 完成缺失值处理、分组统计、业务结论提取，并保存一张销售额柱状图。示例数据直接写在代码中，因此无需额外下载文件。",
    dependencies: ["pandas", "matplotlib"],
    install: "python -m pip install pandas matplotlib",
    steps: ["构造包含缺失值的销售数据", "使用中位数填补缺失销售额", "按地区和产品进行聚合", "输出结论并保存图表"],
    code: `# 导入数据处理和绘图库
import pandas as pd
import matplotlib.pyplot as plt

# 1. 构造一个小型销售数据集。
# 实际项目中可替换为：df = pd.read_csv("sales.csv")
data = {
    "date": ["2026-01-01", "2026-01-02", "2026-01-03",
             "2026-01-04", "2026-01-05", "2026-01-06"],
    "region": ["华东", "华西", "华东", "华西", "华东", "华西"],
    "product": ["A", "B", "C", "C", "A", "B"],
    "sales": [120.0, 98.0, None, 130.0, 150.0, 160.0],
    "quantity": [3, 2, 4, 3, 4, 5],
}
df = pd.DataFrame(data)
df["date"] = pd.to_datetime(df["date"])

# 2. 检查缺失值，并用销售额中位数填补。
print("缺失值数量：")
print(df.isna().sum()[df.isna().sum() > 0])
sales_median = df["sales"].median()
df["sales"] = df["sales"].fillna(sales_median)
print(f"用于填补的销售额中位数：{sales_median:.2f}")

# 3. 计算每笔订单的平均件单价。
df["unit_price"] = df["sales"] / df["quantity"]

# 4. 按地区统计总销售额、平均销售额和订单数。
region_summary = (
    df.groupby("region")["sales"]
      .agg(total_sales="sum", average_sales="mean", orders="count")
      .sort_values("total_sales", ascending=False)
)

# 5. 按产品统计总销售额，并找出第一名。
product_sales = df.groupby("product")["sales"].sum().sort_values(ascending=False)
top_product = product_sales.index[0]

print("\\n地区销售汇总：")
print(region_summary.round(2))
print("\\n产品销售额：")
print(product_sales.round(2))
print(f"\\n销售额最高的产品：{top_product}，销售额 {product_sales.iloc[0]:.2f}")

# 6. 保存图表。服务器或无界面环境中也能正常执行。
ax = product_sales.plot(kind="bar", color=["#f06f55", "#3c7cc9", "#2c9876"])
ax.set_title("各产品销售额")
ax.set_xlabel("产品")
ax.set_ylabel("销售额")
plt.tight_layout()
plt.savefig("product_sales.png", dpi=150)
print("图表已保存：product_sales.png")`,
    output: `缺失值数量：
sales    1
用于填补的销售额中位数：130.00

地区销售汇总：
        total_sales  average_sales  orders
region
华东            400.0         133.33       3
华西            388.0         129.33       3

产品销售额：
product
A    270.0
C    260.0
B    258.0

销售额最高的产品：A，销售额 270.00
图表已保存：product_sales.png`,
    notes: ["代码会在当前目录生成 product_sales.png。", "真实数据中还应检查重复订单、负数销售额、日期范围和货币单位。", "Matplotlib 首次显示中文可能需要配置本机中文字体，但不影响统计结果。"]
  };

  projects["加州房价预测"] = {
    filename: "california_housing.py",
    runtime: "约 30～90 秒",
    goal: "建立规范的回归实验：划分数据、使用 Pipeline 防止泄漏、比较 Ridge 与随机森林，并使用 RMSE 和 R² 评价模型。",
    dependencies: ["scikit-learn", "pandas", "numpy"],
    install: "python -m pip install scikit-learn pandas numpy",
    steps: ["加载加州房价数据", "划分训练集和测试集", "训练线性与非线性模型", "比较指标并输出样例预测"],
    code: `import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# 1. 加载数据。首次运行会从 sklearn 数据源下载并缓存。
housing = fetch_california_housing(as_frame=True)
X = housing.data
y = housing.target  # 单位约为 10 万美元

print(f"样本数：{len(X)}，特征数：{X.shape[1]}")

# 2. 固定随机种子划分数据，保证实验可以复现。
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. Ridge 对特征尺度敏感，因此把标准化与模型放进 Pipeline。
# StandardScaler 只会在训练集上拟合，避免测试集信息泄漏。
ridge = Pipeline([
    ("scaler", StandardScaler()),
    ("model", Ridge(alpha=1.0)),
])

# 4. 随机森林可以学习非线性关系，通常无需标准化。
forest = RandomForestRegressor(
    n_estimators=120,
    max_depth=12,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
)

models = {"Ridge": ridge, "RandomForest": forest}
results = {}

for name, model in models.items():
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    rmse = mean_squared_error(y_test, predictions) ** 0.5
    r2 = r2_score(y_test, predictions)
    results[name] = (rmse, r2, predictions)
    print(f"{name:12s} | RMSE={rmse:.3f} | R2={r2:.3f}")

# 5. 输出随机森林前 5 条预测，与真实值做直观比较。
best_predictions = results["RandomForest"][2]
print("\\n前 5 条预测（单位：10 万美元）：")
for index, (actual, predicted) in enumerate(zip(y_test.iloc[:5], best_predictions[:5]), 1):
    print(f"样本 {index}: 真实={actual:.2f}, 预测={predicted:.2f}")

# 6. 给出模型选择结论。
winner = min(results, key=lambda name: results[name][0])
print(f"\\n按 RMSE 选择的模型：{winner}")`,
    output: `样本数：20640，特征数：8
Ridge        | RMSE≈0.746 | R2≈0.576
RandomForest | RMSE≈0.52  | R2≈0.79

前 5 条预测（单位：10 万美元）：
样本 1: 真实=0.48, 预测≈0.50
样本 2: 真实=0.46, 预测≈0.73
样本 3: 真实=5.00, 预测≈4.8
...

按 RMSE 选择的模型：RandomForest`,
    notes: ["不同 scikit-learn 版本和硬件可能造成最后几位数差异，因此这里给出合理范围。", "fetch_california_housing 首次运行需要网络，下载后会使用本机缓存。", "房价目标有上限截断，深入分析时应检查残差分布与区域偏差。"]
  };

  projects["垃圾邮件识别"] = {
    filename: "spam_classifier.py",
    runtime: "约 10 秒",
    goal: "使用 TF-IDF 把文本转换为数值特征，通过逻辑回归完成垃圾邮件分类，并查看模型认为最可疑的词。",
    dependencies: ["scikit-learn", "numpy"],
    install: "python -m pip install scikit-learn numpy",
    steps: ["准备带标签文本", "构建 TF-IDF 与逻辑回归 Pipeline", "交叉验证", "预测新文本并解释关键词"],
    code: `import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import Pipeline

# 1 表示垃圾邮件，0 表示正常邮件。
texts = [
    "Win a free phone now click this prize link",
    "Limited offer claim your cash reward today",
    "Congratulations you won a lottery reply now",
    "Cheap loan approved instantly no credit check",
    "Exclusive deal buy now and save ninety percent",
    "Urgent verify account to receive your bonus",
    "Free vacation winner call this number now",
    "Earn money fast from home guaranteed income",
    "Your package requires a small payment click here",
    "Act now this reward expires tonight",
    "Team meeting moved to three pm tomorrow",
    "Please review the attached project report",
    "Dinner with family is confirmed for Saturday",
    "Your order has shipped and arrives on Monday",
    "Can we discuss the budget after lunch",
    "The class notes are available in the shared folder",
    "Reminder your doctor appointment is at ten",
    "Thanks for helping me fix the program",
    "Here are the photos from our weekend trip",
    "The monthly invoice has been paid successfully",
]
labels = np.array([1] * 10 + [0] * 10)

# Pipeline 保证交叉验证时，每一折的 TF-IDF 只在训练折拟合。
model = Pipeline([
    ("tfidf", TfidfVectorizer(lowercase=True, ngram_range=(1, 2), min_df=1)),
    ("classifier", LogisticRegression(C=2.0, max_iter=1000, random_state=42)),
])

# 分层交叉验证保证每折中两类比例一致。
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, texts, labels, cv=cv, scoring="f1")
print(f"5 折 F1：{scores.mean():.3f} ± {scores.std():.3f}")

# 使用全部示例训练最终演示模型。
model.fit(texts, labels)

new_messages = [
    "Free cash prize click now",
    "Please send me the meeting minutes",
    "Your account won a bonus reward",
]
probabilities = model.predict_proba(new_messages)[:, 1]

print("\\n新邮件预测：")
for message, probability in zip(new_messages, probabilities):
    label = "垃圾邮件" if probability >= 0.5 else "正常邮件"
    print(f"[{label}] 概率={probability:.3f} | {message}")

# 查看垃圾邮件方向权重最大的词，帮助解释模型。
vectorizer = model.named_steps["tfidf"]
classifier = model.named_steps["classifier"]
feature_names = vectorizer.get_feature_names_out()
top_indices = np.argsort(classifier.coef_[0])[-8:][::-1]
print("\\n最可疑关键词：", ", ".join(feature_names[top_indices]))`,
    output: `5 折 F1：通常约 0.85～1.00

新邮件预测：
[垃圾邮件] 概率>0.50 | Free cash prize click now
[正常邮件] 概率<0.50 | Please send me the meeting minutes
[垃圾邮件] 概率>0.50 | Your account won a bonus reward

最可疑关键词：now, reward, free, click, bonus, ...`,
    notes: ["示例数据很小，只用于展示完整流程，不能直接用于真实邮箱。", "真实项目应加入数千条以上数据，并处理 HTML、链接、语言和类别不平衡。", "交叉验证的具体分数可能因 scikit-learn 版本略有差异。"]
  };

  projects["客户群体画像"] = {
    filename: "customer_segmentation.py",
    runtime: "约 10 秒",
    goal: "使用 RFM 风格特征对客户聚类，并把无意义的簇编号转换为可解释的客户群名称。",
    dependencies: ["scikit-learn", "pandas", "matplotlib"],
    install: "python -m pip install scikit-learn pandas matplotlib",
    steps: ["构造客户特征", "标准化后执行 K-Means", "按中心消费额命名群组", "使用 PCA 绘制二维结果"],
    code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# 每行表示一个客户：年消费额、购买次数、距上次购买天数。
df = pd.DataFrame({
    "customer": [f"C{i:02d}" for i in range(1, 13)],
    "annual_spend": [1200, 1500, 1000, 1800, 4800, 5200, 5600, 5000, 12000, 13500, 12800, 13700],
    "frequency": [2, 3, 1, 3, 7, 8, 7, 6, 15, 17, 16, 16],
    "recency_days": [160, 130, 180, 110, 45, 30, 35, 50, 12, 8, 10, 7],
})

features = ["annual_spend", "frequency", "recency_days"]
X = df[features]

# 1. K-Means 使用欧氏距离，必须先统一特征尺度。
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 2. 固定 random_state；n_init 表示使用多组初始中心并保留最佳结果。
kmeans = KMeans(n_clusters=3, n_init=20, random_state=42)
raw_labels = kmeans.fit_predict(X_scaled)

# 3. 把中心转换回原单位，再按消费额从低到高命名。
centers = scaler.inverse_transform(kmeans.cluster_centers_)
spend_order = np.argsort(centers[:, 0])
segment_names = ["低频待激活", "稳定成长", "高价值忠诚"]
label_to_name = {
    cluster_id: segment_names[rank]
    for rank, cluster_id in enumerate(spend_order)
}
df["segment"] = [label_to_name[label] for label in raw_labels]

summary = (
    df.groupby("segment")[features]
      .agg(["mean", "count"])
)

print("客户群数量：")
print(df["segment"].value_counts())
print("\\n各群平均画像：")
for segment in segment_names:
    group = df[df["segment"] == segment]
    print(
        f"{segment}: 人数={len(group)}, "
        f"年消费={group['annual_spend'].mean():.0f}, "
        f"频次={group['frequency'].mean():.1f}, "
        f"最近购买={group['recency_days'].mean():.1f}天"
    )

# 4. PCA 只用于把三维特征投影到二维进行展示。
pca = PCA(n_components=2)
points_2d = pca.fit_transform(X_scaled)

colors = {"低频待激活": "#f06f55", "稳定成长": "#3c7cc9", "高价值忠诚": "#2c9876"}
for segment in segment_names:
    mask = df["segment"] == segment
    plt.scatter(points_2d[mask, 0], points_2d[mask, 1], label=segment, color=colors[segment], s=70)
plt.legend()
plt.title("客户群体 PCA 可视化")
plt.tight_layout()
plt.savefig("customer_segments.png", dpi=150)
print("\\n图表已保存：customer_segments.png")`,
    output: `客户群数量：
低频待激活    4
稳定成长      4
高价值忠诚    4

各群平均画像：
低频待激活: 人数=4, 年消费=1375, 频次=2.2, 最近购买=145.0天
稳定成长: 人数=4, 年消费=5150, 频次=7.0, 最近购买=40.0天
高价值忠诚: 人数=4, 年消费=13000, 频次=16.0, 最近购买=9.2天

图表已保存：customer_segments.png`,
    notes: ["K-Means 的原始簇编号没有大小含义，因此代码根据中心消费额重新命名。", "真实项目应使用肘部法、轮廓系数和业务可行动性共同选择 K。", "PCA 只用于展示，聚类本身使用全部三个标准化特征。"]
  };

  projects["手写数字分类"] = {
    filename: "mnist_mlp.py",
    runtime: "CPU 约 2～5 分钟",
    goal: "使用 PyTorch 完成完整深度学习训练循环：下载数据、定义 MLP、训练、验证并输出分类准确率。",
    dependencies: ["torch", "torchvision"],
    install: "python -m pip install torch torchvision",
    steps: ["加载并归一化 MNIST", "定义三层 MLP", "执行前向、反向和参数更新", "在测试集计算准确率"],
    code: `import random
import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# 固定随机种子，尽量让多次训练结果接近。
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("使用设备：", device)

# 1. ToTensor 把像素缩放到 0～1；Normalize 再按 MNIST 均值方差标准化。
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,)),
])

train_set = datasets.MNIST("./data", train=True, download=True, transform=transform)
test_set = datasets.MNIST("./data", train=False, download=True, transform=transform)

train_loader = DataLoader(train_set, batch_size=128, shuffle=True, num_workers=0)
test_loader = DataLoader(test_set, batch_size=256, shuffle=False, num_workers=0)

# 2. 每张图片为 1×28×28，先展平为 784 维向量。
class DigitMLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.network = nn.Sequential(
            nn.Flatten(),
            nn.Linear(28 * 28, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, 10),  # 输出 0～9 十个类别的 logits
        )

    def forward(self, images):
        return self.network(images)


model = DigitMLP().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

# 3. 训练三轮。CrossEntropyLoss 内部已经包含 Softmax，不要手动重复。
for epoch in range(1, 4):
    model.train()
    total_loss = 0.0
    correct = 0
    total = 0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()       # 清空上一批次梯度
        logits = model(images)      # 前向传播
        loss = criterion(logits, labels)
        loss.backward()             # 反向传播计算梯度
        optimizer.step()            # Adam 更新参数

        total_loss += loss.item() * images.size(0)
        correct += (logits.argmax(dim=1) == labels).sum().item()
        total += labels.size(0)

    print(
        f"Epoch {epoch}: "
        f"loss={total_loss / total:.4f}, "
        f"train_acc={correct / total:.4f}"
    )

# 4. 测试阶段关闭 Dropout，并且不构建梯度计算图。
model.eval()
test_correct = 0
test_total = 0
sample_predictions = []

with torch.no_grad():
    for images, labels in test_loader:
        images, labels = images.to(device), labels.to(device)
        predictions = model(images).argmax(dim=1)
        test_correct += (predictions == labels).sum().item()
        test_total += labels.size(0)

        if not sample_predictions:
            sample_predictions = list(zip(labels[:10].cpu().tolist(), predictions[:10].cpu().tolist()))

print(f"测试集准确率：{test_correct / test_total:.4f}")
print("前 10 个样本（真实, 预测）：", sample_predictions)

torch.save(model.state_dict(), "mnist_mlp.pth")
print("模型已保存：mnist_mlp.pth")`,
    output: `使用设备：cpu（有 CUDA 时显示 cuda）
Epoch 1: loss≈0.25, train_acc≈0.925
Epoch 2: loss≈0.11, train_acc≈0.966
Epoch 3: loss≈0.08, train_acc≈0.976
测试集准确率：通常约 0.970～0.980
前 10 个样本（真实, 预测）：大多数二元组相同
模型已保存：mnist_mlp.pth`,
    notes: ["首次运行会下载约 12MB 的 MNIST 数据。", "GPU、PyTorch 版本和随机批次会让指标略有变化。", "若想继续提升，可改用 CNN；本项目刻意使用 MLP 以突出基础训练循环。"]
  };

  projects["猫狗图像分类"] = {
    filename: "cats_dogs_transfer.py",
    runtime: "GPU 约 5～15 分钟",
    goal: "使用预训练 ResNet18 进行迁移学习。代码包含数据增强、冻结骨干、训练分类头和验证准确率。",
    dependencies: ["torch", "torchvision", "Pillow"],
    install: "python -m pip install torch torchvision pillow",
    steps: ["按 ImageFolder 目录准备数据", "应用训练增强与验证预处理", "加载预训练 ResNet18", "训练并保存最佳模型"],
    code: `from pathlib import Path
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, models, transforms
from torchvision.models import ResNet18_Weights

# 数据目录必须是下面的结构：
# data/cats_dogs/train/cat/*.jpg
# data/cats_dogs/train/dog/*.jpg
# data/cats_dogs/val/cat/*.jpg
# data/cats_dogs/val/dog/*.jpg
DATA_ROOT = Path("data/cats_dogs")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

if not (DATA_ROOT / "train").exists():
    raise FileNotFoundError("请先按代码注释创建 data/cats_dogs/train 和 val 目录")

# 1. 训练集随机增强，验证集只做确定性预处理。
train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])
val_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

train_set = datasets.ImageFolder(DATA_ROOT / "train", transform=train_transform)
val_set = datasets.ImageFolder(DATA_ROOT / "val", transform=val_transform)
train_loader = DataLoader(train_set, batch_size=32, shuffle=True, num_workers=0)
val_loader = DataLoader(val_set, batch_size=64, shuffle=False, num_workers=0)

print("类别映射：", train_set.class_to_idx)
print(f"训练图片：{len(train_set)}，验证图片：{len(val_set)}")

# 2. 加载 ImageNet 预训练权重。首次运行会自动下载权重。
model = models.resnet18(weights=ResNet18_Weights.DEFAULT)

# 冻结卷积骨干，只训练最后的分类层，适合数据较少的情况。
for parameter in model.parameters():
    parameter.requires_grad = False

input_features = model.fc.in_features
model.fc = nn.Sequential(
    nn.Dropout(0.25),
    nn.Linear(input_features, 2),
)
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.fc.parameters(), lr=2e-3, weight_decay=1e-4)

best_accuracy = 0.0

for epoch in range(1, 6):
    # 3. 训练分类头。
    model.train()
    train_loss = 0.0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        logits = model(images)
        loss = criterion(logits, labels)
        loss.backward()
        optimizer.step()
        train_loss += loss.item() * images.size(0)

    # 4. 在独立验证集评价，不参与参数更新。
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            predictions = model(images).argmax(dim=1)
            correct += (predictions == labels).sum().item()
            total += labels.size(0)

    accuracy = correct / total
    print(
        f"Epoch {epoch}: "
        f"train_loss={train_loss / len(train_set):.4f}, "
        f"val_acc={accuracy:.4f}"
    )

    if accuracy > best_accuracy:
        best_accuracy = accuracy
        torch.save({
            "state_dict": model.state_dict(),
            "classes": train_set.classes,
        }, "best_cats_dogs_resnet18.pth")

print(f"最佳验证准确率：{best_accuracy:.4f}")
print("最佳模型已保存：best_cats_dogs_resnet18.pth")`,
    output: `类别映射：{'cat': 0, 'dog': 1}
训练图片：例如 2000，验证图片：例如 500
Epoch 1: train_loss≈0.35, val_acc≈0.90
Epoch 2: train_loss≈0.25, val_acc≈0.93
...
最佳验证准确率：常见约 0.90～0.97
最佳模型已保存：best_cats_dogs_resnet18.pth`,
    notes: ["准确率取决于图片数量、标注质量和类别平衡，因此预期输出使用范围表示。", "首次运行会下载 ResNet18 预训练权重。", "数据较多时可解冻 layer4，并用更小学习率进行第二阶段微调。"]
  };

  projects["评论情感分析"] = {
    filename: "chinese_sentiment_lstm.py",
    runtime: "约 20～60 秒",
    goal: "不依赖外部大模型，使用字符级词表和 PyTorch LSTM 完成一个可运行的中文二分类示例。",
    dependencies: ["torch"],
    install: "python -m pip install torch",
    steps: ["建立字符词表", "编码并补齐文本", "训练 Embedding + LSTM", "预测新评论的正面概率"],
    code: `import random
import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

random.seed(42)
torch.manual_seed(42)

# 1 表示正面，0 表示负面。小数据仅用于讲解完整流程。
samples = [
    ("这部电影非常精彩演员表现很好", 1),
    ("剧情紧凑结局让我很感动", 1),
    ("画面漂亮音乐也非常好听", 1),
    ("故事温暖值得再次观看", 1),
    ("节奏舒服角色塑造很成功", 1),
    ("笑点自然是一部好电影", 1),
    ("表演真诚内容很有力量", 1),
    ("整体超出预期推荐观看", 1),
    ("剧情混乱看得非常无聊", 0),
    ("演员表演生硬浪费时间", 0),
    ("节奏拖沓结局令人失望", 0),
    ("故事空洞完全没有意思", 0),
    ("画面粗糙声音也很糟糕", 0),
    ("角色讨厌剧情不知所云", 0),
    ("这是我看过最差的电影", 0),
    ("内容重复不推荐观看", 0),
]

# 1. 建立字符级词表。0 留给 PAD，1 留给未知字符 UNK。
all_chars = sorted(set("".join(text for text, _ in samples)))
char_to_id = {char: index + 2 for index, char in enumerate(all_chars)}
PAD_ID, UNK_ID = 0, 1
MAX_LENGTH = 20


def encode(text):
    """把中文字符串转换为固定长度的字符编号。"""
    ids = [char_to_id.get(char, UNK_ID) for char in text[:MAX_LENGTH]]
    ids += [PAD_ID] * (MAX_LENGTH - len(ids))
    return ids


features = torch.tensor([encode(text) for text, _ in samples], dtype=torch.long)
labels = torch.tensor([label for _, label in samples], dtype=torch.float32)
loader = DataLoader(TensorDataset(features, labels), batch_size=8, shuffle=True)


class SentimentLSTM(nn.Module):
    def __init__(self, vocab_size):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, 32, padding_idx=PAD_ID)
        self.lstm = nn.LSTM(input_size=32, hidden_size=48, batch_first=True)
        self.classifier = nn.Linear(48, 1)

    def forward(self, token_ids):
        embedded = self.embedding(token_ids)
        _, (hidden, _) = self.lstm(embedded)
        # hidden[-1] 是最后一层 LSTM 的序列表示。
        return self.classifier(hidden[-1]).squeeze(1)


model = SentimentLSTM(vocab_size=len(char_to_id) + 2)
criterion = nn.BCEWithLogitsLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# 2. 小数据训练 120 轮是为了让演示模型充分拟合。
for epoch in range(1, 121):
    model.train()
    total_loss = 0.0
    for batch_x, batch_y in loader:
        optimizer.zero_grad()
        logits = model(batch_x)
        loss = criterion(logits, batch_y)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * len(batch_x)

    if epoch in {1, 30, 60, 90, 120}:
        print(f"Epoch {epoch:3d}: loss={total_loss / len(samples):.4f}")

# 3. Sigmoid 把 logit 转成正面概率。
test_reviews = [
    "演员很好剧情精彩",
    "内容无聊非常失望",
    "画面很好但是剧情拖沓",
]
model.eval()
with torch.no_grad():
    test_x = torch.tensor([encode(text) for text in test_reviews])
    positive_probabilities = torch.sigmoid(model(test_x))

print("\\n预测结果：")
for text, probability in zip(test_reviews, positive_probabilities):
    sentiment = "正面" if probability.item() >= 0.5 else "负面"
    print(f"{text} -> {sentiment}，正面概率={probability.item():.3f}")`,
    output: `Epoch   1: loss≈0.70
Epoch  30: loss 通常低于 0.10
Epoch 120: loss 通常接近 0

预测结果：
演员很好剧情精彩 -> 正面，正面概率通常 > 0.80
内容无聊非常失望 -> 负面，正面概率通常 < 0.20
画面很好但是剧情拖沓 -> 概率可能接近中间区域`,
    notes: ["第三句同时包含正负信息，预测可能因随机训练略有变化，这是合理现象。", "真实项目必须使用更大训练集、验证集、预训练词向量或 Transformer。", "字符级方法简单但无法直接获得分词和词义层面的表示。"]
  };

  projects["学习笔记 RAG"] = {
    filename: "notes_rag.py",
    runtime: "约 10 秒",
    goal: "构建一个完全本地、无需 API 的迷你 RAG：切分笔记、TF-IDF 向量检索、返回证据并生成基于证据的回答。",
    dependencies: ["scikit-learn", "numpy"],
    install: "python -m pip install scikit-learn numpy",
    steps: ["准备知识片段", "构建字符级 TF-IDF 索引", "检索最相似证据", "根据证据组合回答并显示来源"],
    code: `import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# 1. 每条字典代表一个已经切分好的学习笔记片段。
documents = [
    {
        "source": "机器学习基础.md",
        "text": "过拟合是模型在训练集表现很好，但在未见数据上表现明显下降。常见原因是模型过于复杂或训练数据太少。",
    },
    {
        "source": "模型优化.md",
        "text": "缓解过拟合可以使用正则化、交叉验证、增加数据、数据增强、早停或降低模型复杂度。",
    },
    {
        "source": "深度学习.md",
        "text": "Dropout 在训练时随机关闭部分神经元，减少神经元之间的共同适应，是神经网络常用的正则化方法。",
    },
    {
        "source": "强化学习.md",
        "text": "Q-Learning 使用下一状态的最大 Q 值作为时序差分目标，是一种 Off-policy 控制算法。",
    },
    {
        "source": "评估指标.md",
        "text": "分类任务不能只看准确率。不平衡数据通常还要查看精确率、召回率、F1 和 PR-AUC。",
    },
]

# 2. 中文不做分词，直接使用 2～4 字符 n-gram 建立向量。
vectorizer = TfidfVectorizer(analyzer="char", ngram_range=(2, 4))
document_matrix = vectorizer.fit_transform([doc["text"] for doc in documents])


def retrieve(question, top_k=2):
    """返回与问题最相似的 top_k 个笔记片段。"""
    question_vector = vectorizer.transform([question])
    similarities = cosine_similarity(question_vector, document_matrix)[0]
    top_indices = np.argsort(similarities)[::-1][:top_k]
    return [
        {
            **documents[index],
            "score": float(similarities[index]),
        }
        for index in top_indices
    ]


def answer(question):
    """用检索证据生成一个可追溯的模板回答。"""
    evidence = retrieve(question, top_k=2)
    context = "；".join(item["text"] for item in evidence)
    response = f"根据学习笔记：{context}"
    return response, evidence


question = "什么是过拟合？有哪些缓解方法？"
response, evidence = answer(question)

print("问题：", question)
print("\\n检索证据：")
for rank, item in enumerate(evidence, 1):
    print(f"{rank}. [{item['source']}] 相似度={item['score']:.3f}")
    print("   ", item["text"])

print("\\n回答：")
print(response)`,
    output: `问题：什么是过拟合？有哪些缓解方法？

检索证据：
1. [机器学习基础.md] 相似度最高
   过拟合是模型在训练集表现很好，但在未见数据上表现明显下降...
2. [模型优化.md] 相似度次高
   缓解过拟合可以使用正则化、交叉验证、增加数据...

回答：
根据学习笔记：过拟合是模型在训练集表现很好...；缓解过拟合可以使用正则化...`,
    notes: ["这是为了讲清 RAG 数据流而设计的本地版本，生成阶段使用可追溯模板。", "生产系统可把 TF-IDF 替换为 Embedding + 向量数据库，再把证据交给大语言模型生成。", "无论是否使用大模型，都应返回来源并设置最低相似度阈值。"]
  };

  projects["FrozenLake 智能体"] = {
    filename: "frozenlake_qlearning.py",
    runtime: "约 10～30 秒",
    goal: "从零实现表格型 Q-Learning，展示探索率衰减、TD 更新、训练成功率与最终贪心路线。",
    dependencies: ["gymnasium", "numpy"],
    install: "python -m pip install gymnasium numpy",
    steps: ["创建确定性 FrozenLake", "初始化 Q 表", "用 ε-Greedy 训练", "关闭探索后评价并打印路线"],
    code: `import numpy as np
import gymnasium as gym

SEED = 42
rng = np.random.default_rng(SEED)

# is_slippery=False 表示动作结果确定，更适合第一次理解 Q-Learning。
env = gym.make("FrozenLake-v1", is_slippery=False)
n_states = env.observation_space.n
n_actions = env.action_space.n
q_table = np.zeros((n_states, n_actions), dtype=np.float64)

alpha = 0.8       # 学习率：新 TD 目标对旧估计的影响
gamma = 0.95      # 折扣因子：未来奖励的重要程度
epsilon = 1.0     # 初始探索率
epsilon_min = 0.05
epsilon_decay = 0.998
episodes = 5000
recent_success = []

for episode in range(1, episodes + 1):
    state, _ = env.reset(seed=SEED + episode)
    done = False

    while not done:
        # ε-Greedy：训练早期多探索，后期逐渐利用 Q 表。
        if rng.random() < epsilon:
            action = env.action_space.sample()
        else:
            action = int(np.argmax(q_table[state]))

        next_state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated

        # 终止状态没有未来价值，因此 next_best 设为 0。
        next_best = 0.0 if done else np.max(q_table[next_state])
        td_target = reward + gamma * next_best
        td_error = td_target - q_table[state, action]
        q_table[state, action] += alpha * td_error

        state = next_state

    recent_success.append(reward)
    recent_success = recent_success[-500:]
    epsilon = max(epsilon_min, epsilon * epsilon_decay)

    if episode % 1000 == 0:
        print(
            f"Episode {episode}: "
            f"epsilon={epsilon:.3f}, "
            f"最近500回合成功率={np.mean(recent_success):.3f}"
        )

# 关闭探索，用纯贪心策略评价 100 次。
successes = 0
for test_episode in range(100):
    state, _ = env.reset(seed=10000 + test_episode)
    done = False
    while not done:
        action = int(np.argmax(q_table[state]))
        state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated
    successes += int(reward == 1)

print(f"\\n测试成功率：{successes / 100:.2%}")

# 打印一个回合的状态与动作，便于理解最终策略。
action_names = ["左", "下", "右", "上"]
state, _ = env.reset(seed=2026)
route = [state]
actions = []
done = False
while not done and len(actions) < 20:
    action = int(np.argmax(q_table[state]))
    actions.append(action_names[action])
    state, _, terminated, truncated, _ = env.step(action)
    route.append(state)
    done = terminated or truncated

print("状态路线：", " -> ".join(map(str, route)))
print("动作路线：", " -> ".join(actions))
print("\\n学习后的 Q 表：")
print(np.round(q_table, 3))
env.close()`,
    output: `Episode 1000: epsilon≈0.135, 最近500回合成功率逐渐升高
Episode 2000: epsilon≈0.050, 最近500回合成功率通常 >0.90
...
Episode 5000: epsilon=0.050, 最近500回合成功率通常 >0.95

测试成功率：100.00%
状态路线：0 -> ... -> 15
动作路线：常见为 6 步安全路线之一

学习后的 Q 表：终点可达路径上的动作具有更高 Q 值`,
    notes: ["环境是确定性的，因此充分训练后通常能达到 100% 测试成功率。", "Q 值和具体路线可能因探索顺序不同而变化，但都应避开洞并到达状态 15。", "把 is_slippery 改为 True 后，动作具有随机性，需要更多训练并接受成功率低于 100%。"]
  };

  projects["CartPole 平衡杆"] = {
    filename: "cartpole_dqn.py",
    runtime: "CPU 约 3～10 分钟",
    goal: "使用 PyTorch 从零实现 DQN，包括 ε-Greedy、经验回放、在线网络、目标网络、Huber Loss 和梯度裁剪。",
    dependencies: ["gymnasium[classic-control]", "torch", "numpy"],
    install: "python -m pip install \"gymnasium[classic-control]\" torch numpy",
    steps: ["定义 Q 网络与回放缓冲区", "与环境交互并存储转移", "随机批量计算 TD 目标", "软更新目标网络并评价"],
    code: `import math
import random
from collections import deque, namedtuple

import gymnasium as gym
import numpy as np
import torch
from torch import nn

SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

env = gym.make("CartPole-v1")
state_size = env.observation_space.shape[0]  # 位置、速度、角度、角速度
action_size = env.action_space.n            # 向左或向右

Transition = namedtuple("Transition", ["state", "action", "reward", "next_state", "done"])


class ReplayBuffer:
    def __init__(self, capacity=20000):
        self.memory = deque(maxlen=capacity)

    def push(self, *transition):
        self.memory.append(Transition(*transition))

    def sample(self, batch_size):
        return random.sample(self.memory, batch_size)

    def __len__(self):
        return len(self.memory)


class QNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(state_size, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, action_size),
        )

    def forward(self, state):
        return self.network(state)


online_net = QNetwork().to(device)
target_net = QNetwork().to(device)
target_net.load_state_dict(online_net.state_dict())
target_net.eval()

optimizer = torch.optim.AdamW(online_net.parameters(), lr=5e-4)
loss_function = nn.SmoothL1Loss()  # Huber Loss 对异常 TD Error 更稳健
replay = ReplayBuffer()

BATCH_SIZE = 64
GAMMA = 0.99
TAU = 0.005
EPS_START = 1.0
EPS_END = 0.05
EPS_DECAY = 7000
global_step = 0


def select_action(state, training=True):
    """训练时使用 ε-Greedy；评价时始终选择最大 Q 动作。"""
    global global_step
    epsilon = EPS_END + (EPS_START - EPS_END) * math.exp(-global_step / EPS_DECAY)
    if training:
        global_step += 1

    if training and random.random() < epsilon:
        return env.action_space.sample(), epsilon

    state_tensor = torch.tensor(state, dtype=torch.float32, device=device).unsqueeze(0)
    with torch.no_grad():
        action = online_net(state_tensor).argmax(dim=1).item()
    return action, epsilon


def optimize_model():
    if len(replay) < BATCH_SIZE:
        return None

    batch = Transition(*zip(*replay.sample(BATCH_SIZE)))
    states = torch.tensor(np.array(batch.state), dtype=torch.float32, device=device)
    actions = torch.tensor(batch.action, dtype=torch.long, device=device).unsqueeze(1)
    rewards = torch.tensor(batch.reward, dtype=torch.float32, device=device)
    next_states = torch.tensor(np.array(batch.next_state), dtype=torch.float32, device=device)
    dones = torch.tensor(batch.done, dtype=torch.float32, device=device)

    # 在线网络只取当时实际执行动作对应的 Q 值。
    current_q = online_net(states).gather(1, actions).squeeze(1)

    # 目标网络负责产生相对稳定的 TD 目标，且不传播梯度。
    with torch.no_grad():
        next_q = target_net(next_states).max(dim=1).values
        target_q = rewards + GAMMA * (1.0 - dones) * next_q

    loss = loss_function(current_q, target_q)
    optimizer.zero_grad()
    loss.backward()
    torch.nn.utils.clip_grad_norm_(online_net.parameters(), max_norm=10.0)
    optimizer.step()

    # 软更新目标网络：每一步只向在线网络移动很小比例。
    with torch.no_grad():
        for target_parameter, online_parameter in zip(target_net.parameters(), online_net.parameters()):
            target_parameter.data.mul_(1.0 - TAU)
            target_parameter.data.add_(TAU * online_parameter.data)
    return loss.item()


episode_rewards = []
for episode in range(1, 351):
    state, _ = env.reset(seed=SEED + episode)
    total_reward = 0.0
    done = False

    while not done:
        action, epsilon = select_action(state, training=True)
        next_state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated

        replay.push(state, action, reward, next_state, done)
        optimize_model()
        state = next_state
        total_reward += reward

    episode_rewards.append(total_reward)
    if episode % 25 == 0:
        recent_average = np.mean(episode_rewards[-25:])
        print(f"Episode {episode:3d}: avg_reward={recent_average:6.1f}, epsilon={epsilon:.3f}")

# 使用无探索策略评价 20 回合。
evaluation_rewards = []
for episode in range(20):
    state, _ = env.reset(seed=20000 + episode)
    total_reward = 0.0
    done = False
    while not done:
        action, _ = select_action(state, training=False)
        state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated
        total_reward += reward
    evaluation_rewards.append(total_reward)

print(f"\\n20 回合平均评价奖励：{np.mean(evaluation_rewards):.1f}")
torch.save(online_net.state_dict(), "cartpole_dqn.pth")
print("模型已保存：cartpole_dqn.pth")
env.close()`,
    output: `Episode  25: avg_reward 通常约 15～30
Episode 100: avg_reward 通常开始明显上升
Episode 200: avg_reward 可能达到 100～300
Episode 350: avg_reward 常见达到 300～500

20 回合平均评价奖励：通常 >200，训练良好时接近 500
模型已保存：cartpole_dqn.pth`,
    notes: ["强化学习训练波动较大，同一代码的收敛速度也可能不同。", "若 350 回合仍未收敛，可训练到 500 回合或减慢 ε 衰减。", "CartPole-v1 单回合最高奖励为 500；评价均值持续大于 475 表示表现很好。"]
  };

  projects["LunarLander 着陆"] = {
    filename: "lunarlander_ppo.py",
    runtime: "CPU 约 10～30 分钟",
    goal: "使用 Stable-Baselines3 的 PPO 训练 LunarLander，配置日志、保存模型并进行独立评价。",
    dependencies: ["stable-baselines3", "gymnasium[box2d]", "swig"],
    install: "python -m pip install stable-baselines3 swig \"gymnasium[box2d]\"",
    steps: ["创建并监控环境", "配置 PPO 超参数", "训练并保存模型", "用独立环境评价 20 回合"],
    code: `from pathlib import Path
import gymnasium as gym
from stable_baselines3 import PPO
from stable_baselines3.common.evaluation import evaluate_policy
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.utils import set_random_seed

SEED = 42
set_random_seed(SEED)
Path("logs").mkdir(exist_ok=True)

# 1. Monitor 会记录每回合奖励和长度。
train_env = Monitor(gym.make("LunarLander-v3"), filename="logs/train")
train_env.reset(seed=SEED)

# 2. PPO 同时训练策略网络 Actor 和价值网络 Critic。
model = PPO(
    policy="MlpPolicy",
    env=train_env,
    learning_rate=3e-4,
    n_steps=1024,          # 每轮更新前收集的环境步数
    batch_size=64,
    n_epochs=10,           # 同一批轨迹重复优化的轮数
    gamma=0.99,
    gae_lambda=0.95,
    clip_range=0.2,        # 限制新旧策略概率比变化
    ent_coef=0.01,         # 少量熵奖励维持探索
    verbose=1,
    tensorboard_log="logs/tensorboard",
    seed=SEED,
    device="auto",
)

# 3. 20 万步是教学用配置；若奖励仍低可继续追加训练。
model.learn(total_timesteps=200_000, progress_bar=False)
model.save("lunarlander_ppo")
train_env.close()

# 4. 使用新的独立环境评价，避免用训练回合冒充测试结果。
evaluation_env = Monitor(gym.make("LunarLander-v3"))
evaluation_env.reset(seed=2026)
mean_reward, std_reward = evaluate_policy(
    model,
    evaluation_env,
    n_eval_episodes=20,
    deterministic=True,
)

print(f"20 回合平均奖励：{mean_reward:.1f} ± {std_reward:.1f}")
print("是否达到常用解决标准（平均奖励 >= 200）：", mean_reward >= 200)

# 输出一回合的步数和奖励，演示模型推理接口。
observation, _ = evaluation_env.reset(seed=7)
done = False
episode_reward = 0.0
steps = 0
while not done:
    action, _ = model.predict(observation, deterministic=True)
    observation, reward, terminated, truncated, _ = evaluation_env.step(action)
    done = terminated or truncated
    episode_reward += reward
    steps += 1

print(f"示例回合：steps={steps}, reward={episode_reward:.1f}")
print("模型已保存：lunarlander_ppo.zip")
evaluation_env.close()`,
    output: `-----------------------------
| rollout/ep_rew_mean | ... |
| train/approx_kl     | ... |
| train/value_loss    | ... |
-----------------------------
（训练期间会周期性输出 PPO 指标）

20 回合平均奖励：常见约 150～260，充分收敛后通常 >=200
是否达到常用解决标准（平均奖励 >= 200）：True 或 False
示例回合：steps=若干, reward=实际回合奖励
模型已保存：lunarlander_ppo.zip`,
    notes: ["Box2D 在部分 Windows 环境需要先安装 swig，安装命令已经包含。", "20 万步不保证每次都达到 200；可以执行 model.learn(200_000, reset_num_timesteps=False) 继续训练。", "训练日志不是固定输出，真正应关注独立评价的平均奖励和标准差。"]
  };

  projects["自定义决策环境"] = {
    filename: "custom_gridworld.py",
    runtime: "约 10～30 秒",
    goal: "从零实现符合 Gymnasium API 的 4×4 网格环境，通过 env_checker 验证，再使用 Q-Learning 训练与评价。",
    dependencies: ["gymnasium", "numpy"],
    install: "python -m pip install gymnasium numpy",
    steps: ["定义观察与动作空间", "实现 reset 和 step", "使用环境检查器验证 API", "训练 Q 表并打印最终路径"],
    code: `import numpy as np
import gymnasium as gym
from gymnasium import spaces
from gymnasium.utils.env_checker import check_env


class GridGoalEnv(gym.Env):
    """4×4 网格：智能体从左上角移动到右下角。"""

    metadata = {"render_modes": ["ansi"]}

    def __init__(self, size=4, max_steps=40):
        super().__init__()
        self.size = size
        self.max_steps = max_steps
        self.goal_state = size * size - 1

        # 观察是一个离散位置编号 0～15；动作是上、右、下、左。
        self.observation_space = spaces.Discrete(size * size)
        self.action_space = spaces.Discrete(4)
        self.state = 0
        self.steps = 0

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.state = 0
        self.steps = 0
        return self.state, {"position": self._position()}

    def step(self, action):
        row, column = self._position()

        # 动作：0 上、1 右、2 下、3 左。越界时保持原地。
        if action == 0:
            row = max(0, row - 1)
        elif action == 1:
            column = min(self.size - 1, column + 1)
        elif action == 2:
            row = min(self.size - 1, row + 1)
        elif action == 3:
            column = max(0, column - 1)

        self.state = row * self.size + column
        self.steps += 1

        terminated = self.state == self.goal_state
        truncated = self.steps >= self.max_steps and not terminated
        reward = 10.0 if terminated else -0.1
        info = {"position": self._position(), "steps": self.steps}
        return self.state, reward, terminated, truncated, info

    def _position(self):
        return divmod(self.state, self.size)

    def render(self):
        cells = []
        for index in range(self.size * self.size):
            if index == self.state:
                cells.append("A")
            elif index == self.goal_state:
                cells.append("G")
            else:
                cells.append(".")
        rows = [" ".join(cells[i:i + self.size]) for i in range(0, len(cells), self.size)]
        return "\\n".join(rows)


# 1. 检查 reset、step、空间定义和随机种子是否符合 Gymnasium 规范。
check_env(GridGoalEnv(), skip_render_check=True)
print("环境 API 检查通过")

# 2. 使用 Q-Learning 训练这个自定义环境。
env = GridGoalEnv()
q_table = np.zeros((env.observation_space.n, env.action_space.n))
rng = np.random.default_rng(42)
alpha, gamma = 0.5, 0.95
epsilon = 1.0

for episode in range(3000):
    state, _ = env.reset(seed=episode)
    done = False

    while not done:
        if rng.random() < epsilon:
            action = env.action_space.sample()
        else:
            action = int(np.argmax(q_table[state]))

        next_state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated
        next_value = 0.0 if done else np.max(q_table[next_state])
        q_table[state, action] += alpha * (
            reward + gamma * next_value - q_table[state, action]
        )
        state = next_state

    epsilon = max(0.02, epsilon * 0.997)

# 3. 展示训练后的贪心路径。
action_names = ["上", "右", "下", "左"]
state, _ = env.reset(seed=2026)
route = [state]
actions = []
done = False

while not done and len(actions) < 20:
    action = int(np.argmax(q_table[state]))
    actions.append(action_names[action])
    state, reward, terminated, truncated, _ = env.step(action)
    route.append(state)
    done = terminated or truncated

print("训练后的网格：")
print(env.render())
print("状态路线：", " -> ".join(map(str, route)))
print("动作路线：", " -> ".join(actions))
print(f"步数={len(actions)}, 最终奖励={reward:.1f}, 到达目标={state == env.goal_state}")
env.close()`,
    output: `环境 API 检查通过
训练后的网格：
. . . .
. . . .
. . . .
. . . A
状态路线：0 -> ... -> 15
动作路线：由“右”和“下”组成的 6 步最短路径之一
步数=6, 最终奖励=10.0, 到达目标=True`,
    notes: ["同样长度的最短路径不止一条，因此状态路线和动作顺序可能不同。", "环境中每个普通步骤奖励 -0.1，促使智能体选择较短路线。", "继续扩展时可以加入障碍、陷阱、随机移动或连续观察空间。"]
  };

  window.projectCodeData = projects;
})();
