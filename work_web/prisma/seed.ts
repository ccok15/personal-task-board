import "dotenv/config";

import { hash } from "bcryptjs";

import { prisma } from "../lib/prisma";

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const shouldSeedSampleData =
    process.env.SEED_SAMPLE_DATA === "true" ||
    (process.env.SEED_SAMPLE_DATA == null && process.env.NODE_ENV !== "production");
  const passwordHash = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      username: adminUsername,
      passwordHash,
      role: "ADMIN",
    },
    create: {
      username: adminUsername,
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  const existingTaskCount = await prisma.task.count();
  if (shouldSeedSampleData && existingTaskCount === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: "回归测试电源噪声异常",
          description: "当前已复现问题，正在补测不同温度点的数据。",
          submitterName: "产品经理",
          priority: "URGENT",
          status: "IN_PROGRESS",
          progress: 40,
          isPublic: true,
        },
        {
          title: "跟进 A 芯片新批次回流样品",
          description: "物料尚未齐套，当前先挂起等待补料和时间确认。",
          submitterName: "产线负责人",
          priority: "HIGH",
          status: "BLOCKED",
          progress: 30,
          isPublic: true,
        },
        {
          title: "整理本周测试结论与风险点",
          description: "同步给产品和产线，形成下一轮样品建议。",
          submitterName: "测试负责人",
          priority: "MEDIUM",
          status: "PENDING",
          progress: 0,
          isPublic: true,
        },
        {
          title: "补充历史异常复盘记录",
          description: "已经归档到知识库，留作后续追溯。",
          submitterName: "质量负责人",
          priority: "LOW",
          status: "DONE",
          progress: 100,
          isPublic: true,
          completedAt: new Date(),
        },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
