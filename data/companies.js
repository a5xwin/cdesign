const companies = [
    {
      companyId: "comp_1",
      name: "Alpha Inc",
      teams: [
        {
          teamId: "team_1",
          name: "Engineering",
          members: [
            {
              memberId: "mem_1",
              name: "Alice",
              activities: [
                { date: "2024-03-01", type: "coding", hours: 5, tags: ["feature", "frontend"] },
                { date: "2024-03-02", type: "meeting", hours: 2, tags: ["planning"] },
                { date: "2024-03-03", type: "review", hours: 1, tags: ["code"] },
              ],
            },
            {
              memberId: "mem_2",
              name: "Bob",
              activities: [
                { date: "2024-03-01", type: "coding", hours: 6, tags: ["bugfix"] },
                { date: "2024-03-03", type: "meeting", hours: 3, tags: ["sync"] },
              ],
            },
          ],
        },
        {
          teamId: "team_2",
          name: "Design",
          members: [
            {
              memberId: "mem_3",
              name: "Carol",
              activities: [
                { date: "2024-03-02", type: "design", hours: 4, tags: ["ui", "figma"] },
                { date: "2024-03-03", type: "meeting", hours: 2, tags: ["handoff"] },
              ],
            },
          ],
        },
      ],
    },
    {
      companyId: "comp_2",
      name: "Beta LLC",
      teams: [
        {
          teamId: "team_3",
          name: "Marketing",
          members: [
            {
              memberId: "mem_4",
              name: "Dan",
              activities: [
                { date: "2024-03-01", type: "content", hours: 3, tags: ["blog"] },
                { date: "2024-03-02", type: "seo", hours: 2, tags: ["keyword"] },
              ],
            },
            {
              memberId: "mem_5",
              name: "Eve",
              activities: [
                { date: "2024-03-01", type: "content", hours: 4, tags: ["social"] },
                { date: "2024-03-03", type: "meeting", hours: 2, tags: ["sync"] },
              ],
            },
          ],
        },
      ],
    },
  ];
  
  module.exports = companies;
  