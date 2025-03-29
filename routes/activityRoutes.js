const express = require("express");
const router = express.Router();
const companies = require("../data/companies");

// Helper function to find a member by memberId across all companies and teams
const findMemberById = (memberId) => {
  for (const company of companies) {
    for (const team of company.teams) {
      const member = team.members.find(mem => mem.memberId === memberId);
      if (member) return member;
    }
  }
  return null;
};

router.post("/activity", (req, res) => {
  const { memberId, date, type, hours, tags } = req.body;

  // Validate required fields
  if (!memberId || !date || !type || !hours || !tags) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Find the member
  const member = findMemberById(memberId);
  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  // Create new activity object
  const newActivity = { date, type, hours, tags };

  // Add the activity to the member's activities array
  member.activities.push(newActivity);

  res.status(201).json({ message: "Activity added successfully", activity: newActivity });
});

module.exports = router;
