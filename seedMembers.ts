// seedMembers.ts
import axios from "axios";

const BASE_URL = "https://churchattendanceapp-production.up.railway.app"; // your public API
const ADMIN_EMAIL = "admin@church.local";   // change if customized
const ADMIN_PASSWORD = "changeme123";       // change if customized

const members = [
  { name: "Safra",          phone: "", email: "", family: "",                joinDate: "2024-01-13" },
  { name: "Abigail",        phone: "", email: "", family: "Daughter",        joinDate: "2024-01-15" },
  { name: "Rachel Josiah",  phone: "", email: "", family: "Wife",            joinDate: "2024-01-26" },
  { name: "Angel Priya",    phone: "", email: "", family: "",                joinDate: "2024-02-12" },
  { name: "Ashok",          phone: "", email: "", family: "",                joinDate: "2024-02-25" },
  { name: "Jyothi",         phone: "", email: "", family: "Wife",            joinDate: "2024-03-21" },
  { name: "Kavitha",        phone: "", email: "", family: "",                joinDate: "2024-03-23" },
  { name: "Prabhu",         phone: "", email: "", family: "Husband",         joinDate: "2024-03-25" },
  { name: "Yoana",          phone: "", email: "", family: "Daughter",        joinDate: "2024-04-03" },
  { name: "Robie",          phone: "", email: "", family: "Grand Daughter",  joinDate: "2024-04-05" },
  { name: "Angel Raja",     phone: "", email: "", family: "",                joinDate: "2024-04-19" },
  { name: "Gokul",          phone: "", email: "", family: "Head",            joinDate: "2024-04-22" },
  { name: "Felix",          phone: "", email: "", family: "Head",            joinDate: "2024-05-16" },
  { name: "Kavin",          phone: "", email: "", family: "Son",             joinDate: "2024-05-24" },
  { name: "Pratik",         phone: "", email: "", family: "",                joinDate: "2024-06-02" },
  { name: "Stuart",         phone: "", email: "", family: "Son-in-law",      joinDate: "2024-06-12" },
  { name: "Sophie",         phone: "", email: "", family: "Grand daughter",  joinDate: "2024-06-18" },
  { name: "Cynnara",        phone: "", email: "", family: "Daughter in law", joinDate: "2024-07-08" },
  { name: "Anitha",         phone: "", email: "", family: "Wife",            joinDate: "2024-07-19" },
  { name: "Miracle Raja",   phone: "", email: "", family: "",                joinDate: "2024-09-01" },
  { name: "Usha",           phone: "", email: "", family: "Wife",            joinDate: "2024-10-15" },
  { name: "Joshua",         phone: "", email: "", family: "Son",             joinDate: "2024-10-26" },
  { name: "Pravin",         phone: "", email: "", family: "Son",             joinDate: "2024-11-01" },
  { name: "Kevin",          phone: "", email: "", family: "",                joinDate: "2024-11-13" },
  { name: "Shoba",          phone: "", email: "", family: "Daughter",        joinDate: "2024-11-22" },
  { name: "Vasanthi",       phone: "", email: "", family: "Wife",            joinDate: "2024-11-23" },
  { name: "Danni",          phone: "", email: "", family: "Son",             joinDate: "2024-11-23" },
  { name: "Aaron Shepherd", phone: "", email: "", family: "Son",             joinDate: "2024-11-25" },
  { name: "David Josiah",   phone: "", email: "", family: "Head",            joinDate: "2024-12-07" },
  { name: "Anaya",          phone: "", email: "", family: "Daughter",        joinDate: "2024-12-14" },
  { name: "Matthew",        phone: "", email: "", family: "Son",             joinDate: "2024-12-21" },
  { name: "Sam Deenesha",   phone: "", email: "", family: "Son",             joinDate: "2024-12-09" },
  { name: "issaiah doss",   phone: "", email: "", family: "Son",             joinDate: "2024-12-13" },
  { name: "yamuna",         phone: "", email: "", family: "Wife",            joinDate: "2024-12-16" },
  { name: "Kalai",          phone: "", email: "", family: "Husband",         joinDate: "2024-12-31" },
  { name: "Nithis",         phone: "", email: "", family: "",                joinDate: "2024-01-01" },
  { name: "joanna",         phone: "", email: "", family: "",                joinDate: "2024-01-01" },
  { name: "sara",           phone: "", email: "", family: "",                joinDate: "2024-01-01" },
  { name: "Sam Deenesha",   phone: "", email: "", family: "",                joinDate: "2024-01-01" },
  { name: "Swetha",         phone: "", email: "", family: "",                joinDate: "2024-01-01" },
  { name: "Vijaya",         phone: "", email: "", family: "",                joinDate: "2024-01-01" },
  { name: "Evangeline",     phone: "", email: "", family: "",                joinDate: "2024-01-01" },
  { name: "Rubana",         phone: "", email: "", family: "",                joinDate: "2024-01-01" },
  { name: "Jebastine",      phone: "", email: "", family: "",                joinDate: "2024-01-01" },
  { name: "Jabaz",          phone: "", email: "", family: "",                joinDate: "2024-01-01" },
  { name: "Benny",          phone: "", email: "", family: "",                joinDate: "2024-01-01" },
  { name: "Raja Prince",    phone: "", email: "", family: "",                joinDate: "2024-01-01" }
];

async function main() {
  try {
    console.log("Logging in as admin...");
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    const token = loginRes.data.token;
    if (!token) {
      throw new Error("No token returned from login");
    }

    console.log("Got token. Creating members...");

    for (const member of members) {
      try {
        await axios.post(
          `${BASE_URL}/api/members`,
          member,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`Created member: ${member.name}`);
      } catch (err: any) {
        console.error(`Failed for ${member.name}:`, err?.response?.data || err.message);
      }
    }

    console.log("Done seeding members.");
  } catch (err: any) {
    console.error("Fatal error:", err?.response?.data || err.message);
  }
}

main();