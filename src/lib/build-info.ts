// Build-time git metadata injected via next.config `env`. Values are inlined at
// build time, so they are static per deployment (not per request).

export const TIMEZONE = "Asia/Jakarta"
export const TIMEZONE_LABEL = "WIB"

function clean(value: string | undefined) {
  const v = (value ?? "").trim()
  return v && v !== "unknown" ? v : ""
}

export const BUILD_INFO = {
  branch: clean(process.env.NEXT_PUBLIC_GIT_BRANCH),
  commit: clean(process.env.NEXT_PUBLIC_GIT_COMMIT),
  commitSubject: clean(process.env.NEXT_PUBLIC_GIT_COMMIT_SUBJECT),
  commitDate: clean(process.env.NEXT_PUBLIC_GIT_COMMIT_DATE),
}
