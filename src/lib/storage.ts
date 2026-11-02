/** Private Supabase Storage bucket that holds uploaded practical workbooks. */
export const ASSESSMENT_BUCKET = "assessment-submissions";

/** The display name at the end of a stored object path. */
export function storedFileName(path: string) {
  return path.split("/").filter(Boolean).pop() ?? path;
}
