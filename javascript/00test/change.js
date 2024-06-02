const data = [
  {
    model: "2A2",
    stage: "S1",
    version: "V1.0",
  },
  {
    model: "2A2",
    stage: "S2",
    version: "V1.0",
  },
  {
    model: "2A2",
    stage: "S2",
    version: "V2.0",
  },
  {
    model: "6A",
    stage: "S0",
    version: "V0.0",
  },
  {
    model: "6A",
    stage: "S1",
    version: "V1.0",
  },
];
//转为这种形式
const data1 = [
  {
    label: "2A2",
    children: [
      {
        label: "S1",
        version: ["V1.0"],
        parent: "2A2",
      },
      {
        label: "S2",
        version: ["V1.0", "V2.0"],
      },
    ],
  },
];

const transformedData = data.reduce((acc, item) => {
  // 检查当前模型（model）是否已在累加器（acc）中
  const existingModel = acc.find((obj) => obj.label === item.model);

  if (existingModel) {
    // 如果存在，找到对应stage的子对象
    const existingStage = existingModel.children.find(
      (child) => child.label === item.stage
    );

    if (existingStage) {
      // 如果stage已存在，将version添加到数组中
      existingStage.version.push(item.version);
    } else {
      // 如果stage不存在，创建新的子对象并添加
      existingModel.children.push({
        label: item.stage,
        version: [item.version],
        parent: item.model,
      });
    }
  } else {
    // 如果模型不存在，创建新的模型对象并添加到累加器中
    acc.push({
      label: item.model,
      children: [
        {
          label: item.stage,
          version: [item.version],
          parent: item.model,
        },
      ],
    });
  }

  return acc;
}, []);

// 将第一个对象添加到结果数组中，因为reduce初始值为空数组
transformedData.unshift({
  label: "2A2",
  children: [],
});

console.log(transformedData[1].children);

