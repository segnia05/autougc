#!/usr/bin/env bash
# ==============================================================================
# AutoUGC Emergency Zero-Downtime Rollback Script
# Instantly reverts active Kubernetes deployment to previous stable revision
# ==============================================================================

set -euo pipefail

ENVIRONMENT="${1:-production}"
REASON="${2:-Manual DevOps emergency intervention}"
NAMESPACE="autougc-${ENVIRONMENT}"

echo "🚨 [DevOps Rollback] Initiating Emergency Rollback..."
echo "📍 Environment: ${ENVIRONMENT}"
echo "📦 Namespace:   ${NAMESPACE}"
echo "📝 Reason:      ${REASON}"

# Step 1: Revert Kubernetes Deployment
echo "☸️ [Step 1/3] Executing kubectl rollout undo (zero-downtime)..."
kubectl rollout undo deployment/autougc-deployment -n "${NAMESPACE}"

# Step 2: Wait for rollback completion
echo "⏳ [Step 2/3] Waiting for stable replicas to resume serving..."
kubectl rollout status deployment/autougc-deployment -n "${NAMESPACE}" --timeout=120s

# Step 3: Record Immutable Rollback Audit Record
echo "✍️ [Step 3/3] Emitting Rollback Audit Signature..."
ROLLBACK_URL="http://localhost:3000/api/v1/devops/rollback"
curl -s -X POST "${ROLLBACK_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DEVOPS_ROLLBACK_API_KEY:-sec_devops_CHANGE_ME_KEY}" \
  -d "{\"action\":\"rollback\",\"environment\":\"${ENVIRONMENT}\",\"reason\":\"${REASON}\",\"triggeredBy\":\"cli-rollback-script\"}" \
  || echo "Warning: API audit endpoint unreachable, ensure audit is logged manually."

echo "✅ Emergency rollback completed successfully! Previous stable release is active."
