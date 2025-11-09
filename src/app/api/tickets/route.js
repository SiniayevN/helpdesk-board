export async function GET() {
  const tickets = [
    {
      id: 't-1001',
      title: 'Cannot connect to VPN',
      description: 'User reports intermittent VPN connectivity errors.',
      priority: 'High',
      status: 'Open',
      assignee: 'Unassigned',
      updatedAt: '2025-10-31T14:05:00Z'
    },
    {
      id: 't-1002',
      title: 'Email not syncing on mobile',
      description: 'Exchange account not syncing for iOS Mail.',
      priority: 'Medium',
      status: 'In Progress',
      assignee: 'Jordan',
      updatedAt: '2025-10-30T09:12:00Z'
    }
   
  ];

  return Response.json(tickets);
}
