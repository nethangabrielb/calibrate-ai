import { faker } from "@faker-js/faker";

import prisma from "@/lib/prisma";

const USER_ID = "R4YK4drV21oIgGasGwHQeoH2MbFdBNQw";

const JOB_STATUSES = [
  "APPLIED",
  "INTERVIEWING",
  "OFFERED",
  "REJECTED",
] as const;

const TECH_COMPANIES = [
  "Vercel",
  "Stripe",
  "Linear",
  "Notion",
  "Figma",
  "Supabase",
  "PlanetScale",
  "Fly.io",
  "Cloudflare",
  "Railway",
  "Render",
  "Shopify",
  "Atlassian",
  "HashiCorp",
  "Datadog",
  "Sentry",
];

const DEV_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "Software Engineer",
  "Junior Software Engineer",
  "React Developer",
  "Node.js Developer",
  "TypeScript Engineer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Platform Engineer",
];

const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "CAD", "PHP"];

function generateJD(title: string, company: string): string {
  const intros: Record<string, string> = {
    "Frontend Developer": `${company} is looking for a Frontend Developer to build fast, accessible, and delightful user interfaces. You'll work closely with designers and backend engineers to ship features that reach thousands of users.`,
    "Backend Developer": `${company} is hiring a Backend Developer to design and maintain the services that power our platform. You'll own APIs, data pipelines, and the infrastructure that keeps everything running reliably.`,
    "Full-Stack Developer": `${company} is looking for a Full-Stack Developer who can move fluidly between the frontend and backend. You'll take features from design to deployment, owning both the UI and the services behind it.`,
    "Software Engineer": `${company} is seeking a Software Engineer to join a cross-functional team building core product features. You'll collaborate across disciplines to solve hard problems and ship high-quality software.`,
    "Junior Software Engineer": `${company} is hiring a Junior Software Engineer eager to grow their craft. You'll contribute to real features from day one, with mentorship from experienced engineers and a clear path for growth.`,
    "React Developer": `${company} is looking for a React Developer to build and maintain our web application. You'll work on component architecture, state management, and performance — with a strong emphasis on code quality and user experience.`,
    "Node.js Developer": `${company} is hiring a Node.js Developer to build and scale our server-side systems. You'll design APIs, optimize database queries, and work with async patterns at scale.`,
    "TypeScript Engineer": `${company} is seeking a TypeScript Engineer who cares deeply about type safety and developer experience. You'll work across the stack to improve code quality and build robust, maintainable systems.`,
    "DevOps Engineer": `${company} is looking for a DevOps Engineer to own our CI/CD pipelines, cloud infrastructure, and deployment workflows. You'll improve developer velocity and system reliability across the org.`,
    "Site Reliability Engineer": `${company} is hiring an SRE to ensure our platform is highly available, observable, and resilient. You'll work on incident response, capacity planning, and the systems that keep us online.`,
    "Platform Engineer": `${company} is seeking a Platform Engineer to build the internal tools and infrastructure that other engineers rely on. You'll improve the developer experience and help the team ship faster with confidence.`,
  };

  const responsibilities = [
    "Design, build, and maintain scalable features across the stack.",
    "Collaborate with product and design to translate requirements into working software.",
    "Write clean, well-tested code and participate in code reviews.",
    "Identify performance bottlenecks and drive improvements.",
    "Contribute to architectural decisions and technical planning.",
    "Monitor production systems and respond to incidents.",
    "Mentor junior team members and foster a culture of engineering excellence.",
    "Work in an agile environment with iterative delivery cycles.",
  ];

  const requirements = [
    "Strong proficiency in TypeScript and modern JavaScript.",
    "Experience with React and component-driven development.",
    "Familiarity with RESTful APIs and/or GraphQL.",
    "Comfort working with relational databases (PostgreSQL preferred).",
    "Experience with Git and collaborative development workflows.",
    "Ability to debug complex issues across the stack.",
    "Strong communication skills and a collaborative mindset.",
    "A portfolio of shipped projects or open source contributions.",
  ];

  const shuffled = <T>(arr: T[]) => faker.helpers.shuffle([...arr]);
  const pick = <T>(arr: T[], min: number, max: number) =>
    shuffled(arr).slice(0, faker.number.int({ min, max }));

  const intro =
    intros[title] ??
    `${company} is hiring a ${title} to join our growing engineering team.`;
  const resp = pick(responsibilities, 3, 5)
    .map((r) => `• ${r}`)
    .join("\n");
  const reqs = pick(requirements, 3, 5)
    .map((r) => `• ${r}`)
    .join("\n");

  return `${intro}\n\nResponsibilities:\n${resp}\n\nRequirements:\n${reqs}`;
}

async function seed() {
  console.log(`🌱 Seeding jobs for user ${USER_ID}...`);

  const user = await prisma.user.findUnique({ where: { id: USER_ID } });

  if (!user) {
    console.error(`❌ No user found with ID: ${USER_ID}`);
    process.exit(1);
  }

  const deletedAnalyses = await prisma.analysis.deleteMany({
    where: { job: { userId: USER_ID } },
  });

  console.log(`🧹 Deleted ${deletedAnalyses.count} existing analyses.`);

  const deletedJobs = await prisma.job.deleteMany({
    where: { userId: USER_ID },
  });

  console.log(
    `🧹 Deleted ${deletedJobs.count} existing jobs for ${user.email}.`,
  );

  const jobCount = 25;

  await Promise.all(
    Array.from({ length: jobCount }).map(() => {
      const hasSalary = faker.datatype.boolean();
      const company = faker.helpers.arrayElement(TECH_COMPANIES);
      const title = faker.helpers.arrayElement(DEV_ROLES);

      return prisma.job.create({
        data: {
          userId: USER_ID,
          company,
          title,
          description: generateJD(title, company),
          location: faker.helpers.maybe(
            () =>
              faker.datatype.boolean()
                ? "Remote"
                : `${faker.location.city()}, ${faker.location.country()}`,
            { probability: 0.8 },
          ),
          salary: hasSalary
            ? faker.number.int({ min: 40_000, max: 200_000 })
            : null,
          salaryCurrency: hasSalary
            ? faker.helpers.arrayElement(CURRENCIES)
            : null,
          status: faker.helpers.arrayElement(JOB_STATUSES),
          createdAt: faker.date.recent({ days: 90 }),
        },
      });
    }),
  );

  console.log(`🎉 Done! Seeded ${jobCount} jobs for ${user.email}.`);
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
