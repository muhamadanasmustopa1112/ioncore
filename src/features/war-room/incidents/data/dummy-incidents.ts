import type { Incident } from "../types/incident";

export const DUMMY_INCIDENTS: Incident[] = [
  {
    id: "inc-001",
    operational_event_id: "oe-001",
    incident_name: "Fiber Cut — Kelapa Gading",
    declared_by: "NOC Manager",
    declared_at: "2026-06-01T08:00:00Z",
    incident_type: "fiber_cut",
    severity: "P1",
    status: "active",
    affected_areas: [{ area_id: "ar-001", area_name: "Jakarta Utara", estimated_customers_affected: 150 }],
    affected_nodes: [{ node_id: "node-001", node_name: "OLT KG-01", impact_role: "primary" }],
    timeline: [
      { id: "tl-001", entry_type: "update", message: "Incident declared. Fiber node down, Sub Area: Kelapa Gading. Est. 150 customers.", created_by: "NOC", created_at: "2026-06-01T08:00:00Z" },
      { id: "tl-002", entry_type: "broadcast", message: "Broadcast #1 sent to 147 customers (WhatsApp + email).", created_by: "SYSTEM", created_at: "2026-06-01T08:02:00Z" },
      { id: "tl-003", entry_type: "escalation", message: "Severity upgraded to P1. Management notified.", created_by: "NOC Manager", created_at: "2026-06-01T08:03:00Z" },
      { id: "tl-004", entry_type: "update", message: "Root cause confirmed: fiber cut at Jl. Kelapa Gading Raya km 4.", created_by: "NOC", created_at: "2026-06-01T08:05:00Z" },
      { id: "tl-005", entry_type: "wo", message: "Emergency WO #WO-2026-0412 created. 2 technicians dispatched.", created_by: "Team Leader", created_at: "2026-06-01T08:10:00Z" },
    ],
    tasks: [
      { id: "task-001", title: "Dispatch fiber splicing team", assigned_to_role: "team_leader", status: "done", created_at: "2026-06-01T08:10:00Z" },
      { id: "task-002", title: "Notify affected enterprise customers", assigned_to_role: "cs_agent", status: "done", created_at: "2026-06-01T08:05:00Z" },
      { id: "task-003", title: "Verify service restoration", assigned_to_role: "noc", status: "in_progress", created_at: "2026-06-01T08:15:00Z" },
    ],
    broadcasts_sent: [
      { id: "bc-001", broadcast_type: "declared", message: "Service disruption in Kelapa Gading area. Our team is working on it.", channels: ["whatsapp", "email"], recipients_count: 147, delivered_count: 145, sent_by: "NOC Manager", sent_at: "2026-06-01T08:02:00Z" },
    ],
    total_downtime_minutes: 90,
    sla_breached: true,
    created_at: "2026-06-01T08:00:00Z",
  },
  {
    id: "inc-002",
    operational_event_id: "oe-002",
    incident_name: "OLT Down — Sunter",
    declared_by: "NOC",
    declared_at: "2026-06-01T09:30:00Z",
    incident_type: "node_down",
    severity: "P2",
    status: "monitoring",
    affected_areas: [{ area_id: "ar-002", area_name: "Jakarta Timur", estimated_customers_affected: 45 }],
    affected_nodes: [{ node_id: "node-002", node_name: "OLT SUN-01", impact_role: "primary" }],
    timeline: [
      { id: "tl-006", entry_type: "update", message: "OLT SUN-01 went offline. 45 customers affected.", created_by: "NOC", created_at: "2026-06-01T09:30:00Z" },
      { id: "tl-007", entry_type: "broadcast", message: "Service disruption in Sunter area.", channels: "whatsapp", created_by: "SYSTEM", created_at: "2026-06-01T09:35:00Z" },
    ],
    tasks: [
      { id: "task-004", title: "Check OLT power supply", assigned_to_role: "technician", status: "done", created_at: "2026-06-01T09:35:00Z" },
      { id: "task-005", title: "Restart OLT and verify", assigned_to_role: "noc", status: "done", created_at: "2026-06-01T09:40:00Z" },
    ],
    broadcasts_sent: [],
    total_downtime_minutes: 30,
    sla_breached: false,
    created_at: "2026-06-01T09:30:00Z",
  },
];
