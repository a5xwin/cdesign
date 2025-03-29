const express = require("express");
const router = express.Router();
const companies = require("../data/companies");

// GET /report/overview endpoint
router.get("/overview", (req, res) => {
  let totalCompanies = companies.length;
  let totalTeams = 0;
  let totalMembers = 0;
  let totalActivities = 0;
  let totalHours = 0;
  let activityMap = new Map();

  companies.forEach(company => {
    totalTeams += company.teams.length;
    company.teams.forEach(team => {
      totalMembers += team.members.length;
      team.members.forEach(member => {
        totalActivities += member.activities.length;
        member.activities.forEach(activity => {
          totalHours += activity.hours;
          activityMap.set(
            activity.type,
            (activityMap.get(activity.type) || 0) + activity.hours
          );
        });
      });
    });
  });

  // Convert map to sorted array for topActivityTypes
  const topActivityTypes = Array.from(activityMap, ([type, hours]) => ({ type, totalHours: hours }))
    .sort((a, b) => b.totalHours - a.totalHours);

  res.json({
    totalCompanies,
    totalTeams,
    totalMembers,
    totalActivities,
    totalHours,
    topActivityTypes
  });
});

// GET /report/company/:companyId endpoint
router.get("/company/:companyId", (req, res) => {
  const { companyId } = req.params;
  const { startDate, endDate } = req.query;

  // Find the company based on companyId
  const company = companies.find(comp => comp.companyId === companyId);
  if (!company) {
    return res.status(404).json({ error: "Company not found" });
  }

  // Convert query params to Date objects if provided
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // Process each team in the company
  const teamsReport = company.teams.map(team => {
    let totalHours = 0;
    let activityMap = new Map();
    let tagsSet = new Set();

    team.members.forEach(member => {
      member.activities.forEach(activity => {
        // Date filtering: Only include activity if it falls within the date range (if provided)
        const activityDate = new Date(activity.date);
        if ((start && activityDate < start) || (end && activityDate > end)) {
          return; // Skip this activity if it doesn't meet the date criteria
        }
        
        totalHours += activity.hours;

        // Accumulate hours per activity type
        activityMap.set(
          activity.type,
          (activityMap.get(activity.type) || 0) + activity.hours
        );

        // Add all tags for uniqueness
        activity.tags.forEach(tag => tagsSet.add(tag));
      });
    });

    // Convert activityMap to an array for breakdown
    const activityBreakdown = Array.from(activityMap, ([type, hours]) => ({ type, totalHours: hours }));

    return {
      teamId: team.teamId,
      teamName: team.name,
      totalMembers: team.members.length,
      totalHours,
      activityBreakdown,
      uniqueTags: Array.from(tagsSet)
    };
  });

  // BONUS: Activity Summary by Type across all teams in the company
  const summaryMap = new Map();
  company.teams.forEach(team => {
    team.members.forEach(member => {
      member.activities.forEach(activity => {
        const activityDate = new Date(activity.date);
        if ((start && activityDate < start) || (end && activityDate > end)) {
          return;
        }
        if (!summaryMap.has(activity.type)) {
          summaryMap.set(activity.type, { totalHours: 0, members: new Set() });
        }
        const summary = summaryMap.get(activity.type);
        summary.totalHours += activity.hours;
        summary.members.add(member.memberId);
      });
    });
  });

  // Convert summaryMap to an object with the desired format
  const activitySummaryByType = {};
  for (const [type, data] of summaryMap.entries()) {
    activitySummaryByType[type] = { totalHours: data.totalHours, members: data.members.size };
  }

  const companyReport = {
    companyId: company.companyId,
    companyName: company.name,
    teams: teamsReport,
    activitySummaryByType // BONUS: flattened summary across the company
  };

  res.json(companyReport);
});

// GET /report/member/:memberId endpoint
router.get("/member/:memberId", (req, res) => {
  const { memberId } = req.params;
  const { startDate, endDate } = req.query;

  // Find the member by traversing companies and teams
  let foundMember = null;
  for (const company of companies) {
    for (const team of company.teams) {
      const member = team.members.find(mem => mem.memberId === memberId);
      if (member) {
        foundMember = member;
        break;
      }
    }
    if (foundMember) break;
  }

  if (!foundMember) {
    return res.status(404).json({ error: "Member not found" });
  }

  // Convert query params to Date objects if provided
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // Group activities by date
  const dailyMap = new Map();
  foundMember.activities.forEach(activity => {
    const activityDate = new Date(activity.date);
    if ((start && activityDate < start) || (end && activityDate > end)) {
      return;
    }
    if (!dailyMap.has(activity.date)) {
      dailyMap.set(activity.date, { activities: [], hours: 0 });
    }
    const entry = dailyMap.get(activity.date);
    entry.activities.push(activity.type);
    entry.hours += activity.hours;
  });

  // Convert map to sorted daily breakdown array
  const dailyBreakdown = Array.from(dailyMap, ([date, data]) => ({
    date,
    activities: data.activities,
    hours: data.hours
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Sum up total hours for the member
  const totalHours = dailyBreakdown.reduce((sum, day) => sum + day.hours, 0);

  res.json({
    memberId: foundMember.memberId,
    name: foundMember.name,
    totalHours,
    dailyBreakdown
  });
});

// BONUS: POST /activity endpoint to add a new activity for a member
router.post("/activity", (req, res) => {
  const { memberId, date, type, hours, tags } = req.body;
  if (!memberId || !date || !type || hours == null || !tags) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Find the member by traversing companies and teams
  let foundMember = null;
  for (const company of companies) {
    for (const team of company.teams) {
      const member = team.members.find(mem => mem.memberId === memberId);
      if (member) {
        foundMember = member;
        break;
      }
    }
    if (foundMember) break;
  }

  if (!foundMember) {
    return res.status(404).json({ error: "Member not found" });
  }

  // Create new activity
  const newActivity = { date, type, hours, tags };
  foundMember.activities.push(newActivity);
  
  res.status(201).json({ message: "Activity added", activity: newActivity });
});

module.exports = router;
