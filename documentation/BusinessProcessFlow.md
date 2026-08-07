# Business Process Flow

## Payment Exception Management System

| Document field | Value |
|---|---|
| Status | Draft for stakeholder review |
| Version | 1.0 |
| Date | August 7, 2026 |
| Related BRD | `documentation/BusinessRequirementsDocument.md` |
| Related FRD | `documentation/FunctionalRequirementsDocument.md` |
| Editable BPMN files | `visio/PaymentExceptionLifecycle.bpmn`, `visio/PaymentReconciliation.bpmn` |

## 1. Purpose

This document defines the end-to-end business process for detecting, assigning, investigating, resolving, reconciling, and closing payment exceptions. It identifies process participants, decision points, controls, exception paths, inputs, outputs, and status changes.

## 2. Process participants

| Participant | Responsibility |
|---|---|
| Source systems | Provide payment, settlement, and reference data. |
| Payment Exception System | Validate data, create exceptions, apply rules, calculate SLAs, notify users, and maintain audit history. |
| Operations Analyst | Investigate assigned exceptions, request information, document findings, and propose resolution. |
| Reconciliation Analyst | Investigate payment and settlement differences and record match or disposition outcomes. |
| Supervisor | Assign work, review escalations, approve controlled actions, and authorize closure or rework. |
| Finance or Accounting | Confirm financial impact or disposition when required. |
| Compliance or Risk | Review high-risk cases and required evidence when applicable. |
| Reporting platform | Refresh operational and executive reporting from approved data. |

## 3. End-to-end payment exception flow

```mermaid
flowchart TD
    A([Payment exception detected]) --> B[Validate source data]
    B --> C{Data valid?}
    C -- No --> D[Quarantine record and alert support]
    D --> E([Await corrected source data])
    C -- Yes --> F[Create or update exception]
    F --> G[Categorize, prioritize, and calculate SLA]
    G --> H[Apply assignment rules]
    H --> I{Owner found?}
    I -- No --> J[Place in unassigned queue]
    J --> K[Supervisor assigns owner]
    I -- Yes --> L[Analyst investigates]
    K --> L
    L --> M{Information complete?}
    M -- No --> N[Set Pending Information and request details]
    N --> O{Information received before threshold?}
    O -- Yes --> L
    O -- No --> P[Escalate for SLA or business risk]
    M -- Yes --> Q{Escalation required?}
    Q -- Yes --> P
    P --> R[Supervisor or specialist reviews]
    R --> S{More investigation needed?}
    S -- Yes --> L
    S -- No --> T[Record resolution]
    Q -- No --> T
    T --> U{Resolution valid and approvals complete?}
    U -- No --> V[Return for rework]
    V --> L
    U -- Yes --> W[Approve and close exception]
    W --> X[Update audit history, notifications, and reports]
    X --> Y([Exception closed])
```

## 4. Swimlane business flow

```mermaid
flowchart LR
    subgraph SYS[Payment Exception System]
        S1([Detect]) --> S2[Validate]
        S2 --> S3[Create and classify]
        S3 --> S4[Route and calculate SLA]
    end
    subgraph SUP[Supervisor]
        P1[Assign unowned work]
        P2[Review escalation]
        P3[Approve closure or return]
    end
    subgraph ANA[Operations Analyst]
        A1[Investigate]
        A2[Request information]
        A3[Record findings and resolution]
    end
    subgraph FIN[Finance / Reconciliation]
        F1[Validate financial disposition]
    end
    subgraph OUT[System of Record]
        O1[Close and retain audit evidence]
        O2[Refresh reports]
    end

    S4 -->|Rule matched| A1
    S4 -->|No rule matched| P1
    P1 --> A1
    A1 -->|Information missing| A2
    A2 --> A1
    A1 -->|Risk or SLA threshold| P2
    P2 --> A1
    A1 --> A3
    A3 -->|Financial validation required| F1
    F1 --> P3
    A3 -->|No additional validation| P3
    P3 -->|Rework| A1
    P3 -->|Approved| O1
    O1 --> O2
```

## 5. Payment reconciliation flow

```mermaid
flowchart TD
    A([Payment and settlement data received]) --> B[Validate and normalize records]
    B --> C[Apply automatic matching rules]
    C --> D{Fully matched?}
    D -- Yes --> E[Record matched result]
    D -- No --> F[Classify partial or unmatched result]
    F --> G[Reconciliation analyst investigates variance]
    G --> H{Valid manual match available?}
    H -- Yes --> I[Submit manual match or override]
    I --> J{Approval required?}
    J -- Yes --> K[Authorized approver reviews]
    K --> L{Approved?}
    L -- No --> G
    L -- Yes --> E
    J -- No --> E
    H -- No --> M[Record unmatched disposition]
    M --> N[Create or update linked exception]
    E --> O[Update audit and reporting]
    N --> O
    O --> P([Reconciliation status updated])
```

## 6. Assignment and escalation flow

```mermaid
flowchart TD
    A([Exception ready for routing]) --> B[Evaluate active assignment rules in priority order]
    B --> C{Eligible user or queue found?}
    C -- Yes --> D[Assign owner]
    C -- No --> E[Route to unassigned queue]
    E --> F[Notify supervisor]
    F --> G[Supervisor selects eligible owner]
    G --> D
    D --> H[Notify owner and start applicable SLA]
    H --> I{At-risk or escalation condition met?}
    I -- No --> J[Continue normal investigation]
    I -- Yes --> K[Flag and notify escalation recipients]
    K --> L[Move to escalation queue or retain owner per rule]
    L --> M[Supervisor reviews and records decision]
    M --> N{Reassign?}
    N -- Yes --> G
    N -- No --> J
```

## 7. Status lifecycle

```mermaid
stateDiagram-v2
    [*] --> New
    New --> Assigned: owner assigned
    New --> Escalated: immediate risk
    Assigned --> InProgress: work started
    Assigned --> Escalated: escalation rule
    InProgress --> PendingInformation: details requested
    PendingInformation --> InProgress: details received
    PendingInformation --> Escalated: SLA or risk threshold
    InProgress --> Escalated: approval or specialist review
    Escalated --> InProgress: investigation continues
    Escalated --> Resolved: approved outcome
    InProgress --> Resolved: resolution recorded
    Resolved --> InProgress: returned for rework
    Resolved --> Closed: validation and approval complete
    Closed --> Reopened: authorized reopen
    Reopened --> Assigned: reassigned
    Reopened --> InProgress: work resumed
    Reopened --> Escalated: immediate escalation
    Closed --> [*]
```

## 8. Detailed process steps

| Step | Owner | Activity | Key input | Output or status | Primary control |
|---|---|---|---|---|---|
| 1 | System | Receive and validate source event. | Payment or reconciliation data | Valid event or quarantined record | Required fields, format, duplicate key, source authorization |
| 2 | System | Create or update exception. | Valid source event | Unique exception in New status | Idempotency and immutable source references |
| 3 | System | Categorize and prioritize. | Exception attributes and active rules | Category, priority, SLA target | Effective-dated rules and audit record |
| 4 | System or Supervisor | Assign responsible owner. | Routing rules and eligible users | Assigned status and accountable owner | Role, team, scope, workload, fallback queue |
| 5 | Analyst | Review payment, exception, and related history. | Assigned exception | In Progress status | Record-level authorization and concurrency control |
| 6 | Analyst | Request missing information when necessary. | Investigation findings | Pending Information status | Required reason and follow-up date |
| 7 | System or Supervisor | Escalate based on risk, value, age, or SLA. | Threshold event | Escalated status or flag | Approved escalation matrix and notification |
| 8 | Analyst | Record investigation outcome and proposed resolution. | Complete evidence | Resolved status pending approval where required | Mandatory resolution code and summary |
| 9 | Supervisor or Approver | Validate resolution and required approvals. | Resolution and evidence | Approved closure or rework | Authority matrix and segregation of duties |
| 10 | System | Close and publish outcomes. | Approved resolution | Closed status, audit record, updated reports | Immutable history and controlled reporting data |

## 9. Decision rules

| Decision | Rule |
|---|---|
| Data valid? | Required fields, formats, references, source authorization, and duplicate identity pass validation. |
| Owner found? | An active assignment rule returns an eligible user or queue within the exception’s authorized scope. |
| Information complete? | All category-specific mandatory information and evidence required for a resolution are available. |
| Escalation required? | A configured priority, value, risk, aging, SLA, policy, or approval condition is met. |
| Resolution valid? | Required resolution code, summary, evidence, reconciliation state, and approvals are complete. |
| Fully matched? | Approved match keys and amount or tolerance rules are satisfied for the applicable payment and settlement records. |
| Manual match valid? | Records are eligible, not incompatibly matched, and satisfy configured manual-match constraints. |
| Approval required? | Value, risk, override type, business unit, or segregation-of-duties policy requires approval. |

## 10. Alternate and exception paths

| Condition | Process response |
|---|---|
| Invalid inbound data | Quarantine the record, retain the safe rejection reason, and alert support. |
| Duplicate source event | Treat processing as idempotent and do not create duplicate exceptions or actions. |
| No assignment match | Place the exception in the approved unassigned queue and notify the supervisor. |
| Assignee becomes inactive | Prevent new assignments and expose open work for supervisor reassignment. |
| Missing investigation information | Move to Pending Information, record a follow-up date, and apply approved SLA pause behavior. |
| SLA threshold reached | Flag the exception, notify recipients, and apply the configured escalation route. |
| Resolution validation fails | Keep the exception open and identify missing or invalid information. |
| Approval rejected | Return the exception to investigation with the decision and reason retained. |
| Concurrent update | Prevent silent overwrite and require refresh or reconciliation of changes. |
| Integration or notification failure | Record a correlation ID, retry according to policy, and alert support after retry exhaustion. |

## 11. Inputs and outputs

### Inputs

- Payment and settlement events.
- Reconciliation results and source references.
- User, role, team, and business-scope data.
- Exception categories, priorities, resolution codes, SLAs, calendars, and routing rules.
- Analyst notes, supporting references, dispositions, and approvals.

### Outputs

- Assigned and prioritized exception records.
- Status, SLA, escalation, and ownership updates.
- Resolutions, reconciliation dispositions, and closure decisions.
- Notifications and operational alerts.
- Immutable audit events.
- Operational, management, executive, and compliance reporting data.

## 12. Key controls

- Role-based and record-level authorization at every action.
- Masking of sensitive payment information.
- Unique identifiers and idempotent source-event processing.
- Mandatory reasons for reassignment, escalation, override, reopening, and controlled disposition.
- Segregation of duties for high-risk approvals and overrides.
- Effective-dated configuration and rule validation before activation.
- Optimistic concurrency to prevent silent overwrite.
- Immutable history for material user and system actions.
- Consistent KPI definitions and reporting filters.

## 13. Process performance measures

- Time from detection to creation.
- Time from creation to assignment.
- Time from assignment to first analyst action.
- Average and median resolution and closure time.
- Percentage within SLA and percentage at risk or breached.
- Unassigned count and age.
- First-time resolution and reopen rate.
- Escalation rate and approval turnaround time.
- Automatic match rate, manual match rate, unmatched value, and variance aging.
- Backlog, throughput, and exception volume by root cause.

## 14. Validation and approval

The diagrams and flow must be reviewed with Payment Operations, Reconciliation, Finance, Compliance, Product, and Technology. Items requiring confirmation include assignment precedence, SLA pause behavior, approval thresholds, reconciliation tolerances, escalation paths, and final status-transition authority.

| Approver role | Name | Decision | Date |
|---|---|---|---|
| Business owner |  |  |  |
| Product owner |  |  |  |
| Payment Operations |  |  |  |
| Reconciliation or Finance |  |  |  |
| Compliance or Risk |  |  |  |
| Technology |  |  |  |

## 15. Revision history

| Version | Date | Author | Description |
|---|---|---|---|
| 1.0 | August 7, 2026 | Project team | Initial BPMN and business process flow baseline. |
