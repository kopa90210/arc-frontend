// src/components/ui/StatusBadge.jsx
// ─── Reusable order status badge ──────────────────────────────────────────
import { STATUS_PALETTE } from "../../constants/orderStatus";
import { statusText } from "../../utils/orderHelpers";

export default function StatusBadge({ status, style = {} }) {
    const label = statusText(status);
    const palette = STATUS_PALETTE[label] || STATUS_PALETTE.Draft;
    return (
        <span
            style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                background: palette.bg,
                color: palette.color,
                ...style,
            }}
        >
            {label || "Unknown"}
        </span>
    );
}