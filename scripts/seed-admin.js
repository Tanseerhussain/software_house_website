const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const path = require("path")

const env = {}
for (const line of fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8").split(/\r?\n/)) {
  const t = line.trim()
  if (!t || t.startsWith("#")) continue
  const i = t.indexOf("=")
  if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
}

const uri = env.MONGODB_URI
const email = (env.ADMIN_EMAIL || "").trim().toLowerCase()
const password = env.ADMIN_PASSWORD
const fullName = env.ADMIN_NAME || "APPRIC Admin"

if (!uri || !email || !password) {
  console.error("FAIL: MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD are required in .env")
  process.exit(1)
}

;(async () => {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 25000 })
  try {
    await client.connect()
    const db = client.db("APPRIC")
    await db.command({ ping: 1 })
    console.log("OK: connected to Atlas database APPRIC")

    const users = db.collection("portal_users")
    const existing = await users.findOne({ email })

    if (existing) {
      const passwordHash = await bcrypt.hash(password, 10)
      await users.updateOne(
        { email },
        {
          $set: {
            passwordHash,
            fullName,
            role: "admin",
            designation: "Admin",
            approvalStatus: "approved",
            isActive: true,
            updatedAt: new Date(),
          },
        }
      )
      console.log("OK: admin updated")
    } else {
      const now = new Date()
      await users.insertOne({
        email,
        passwordHash: await bcrypt.hash(password, 10),
        fullName,
        role: "admin",
        designation: "Admin",
        phone: null,
        courseProgram: null,
        salary: null,
        approvalStatus: "approved",
        avatarUrl: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })
      console.log("OK: admin created")
    }

    const admin = await users.findOne({ email }, { projection: { passwordHash: 0 } })
    console.log("email:", admin.email)
    console.log("role:", admin.role)
    console.log("approvalStatus:", admin.approvalStatus)
    console.log("fullName:", admin.fullName)
    console.log("portal_users count:", await users.countDocuments())
    await client.close()
    process.exit(0)
  } catch (e) {
    console.error("FAIL:", e.message)
    process.exit(1)
  }
})()
