const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const email = process.argv[2];

    if (!email) {
      console.log("Usage: node check-password.js EMAIL");
      process.exit(1);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      console.log("USER_NOT_FOUND");
      return;
    }

    console.log("USER_FOUND");
    console.log("ID:", user.id);
    console.log("EMAIL:", user.email);
    console.log("ROLE:", user.role);
    console.log("VERIFIED:", user.isVerified);
    console.log("BLOCKED:", user.isBlocked);

    const password = process.env.TEST_PASSWORD;

    if (!password) {
      console.log("PASSWORD_TEST_NOT_RUN");
      console.log("Run again with TEST_PASSWORD environment variable.");
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("PASSWORD_MATCH:", match);
  } catch (e) {
    console.error("CHECK_ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
})();
