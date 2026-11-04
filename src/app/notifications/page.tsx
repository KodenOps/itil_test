import Link from "next/link";
import { redirect } from "next/navigation";
import { MdCampaign, MdCheckCircle, MdMarkEmailRead, MdOutlineQuiz } from "react-icons/md";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { getViewer } from "@/lib/supabase/profile";
import {
  QUESTION_REPORT_STATUS_LABELS,
  type NotificationType,
  type QuestionReportStatus,
} from "@/types/app";

export const dynamic = "force-dynamic";

function iconFor(type: NotificationType) {
  switch (type) {
    case "report_replied":
      return <MdMarkEmailRead size={17} />;
    case "question_updated":
      return <MdOutlineQuiz size={17} />;
    default:
      return <MdCampaign size={17} />;
  }
}

export default async function NotificationsPage() {
  const viewer = await getViewer();

  if (!viewer) redirect("/login?next=/notifications");

  const [{ data: notifications }, { data: reports }] = await Promise.all([
    viewer.supabase
      .from("notifications")
      .select("id, type, title, body, link, read_at, created_at")
      .eq("user_id", viewer.userId)
      .order("created_at", { ascending: false })
      .limit(60)
      .returns<
        {
          id: string;
          type: NotificationType;
          title: string;
          body: string;
          link: string | null;
          read_at: string | null;
          created_at: string;
        }[]
      >(),
    viewer.supabase
      .from("question_reports")
      .select("id, question_prompt, issue_type, status, admin_reply, replied_at, created_at")
      .eq("user_id", viewer.userId)
      .order("created_at", { ascending: false })
      .limit(40)
      .returns<
        {
          id: string;
          question_prompt: string;
          issue_type: string;
          status: QuestionReportStatus;
          admin_reply: string;
          replied_at: string | null;
          created_at: string;
        }[]
      >(),
  ]);

  const items = notifications ?? [];
  const myReports = reports ?? [];

  return (
    <div className='min-h-screen bg-slate-50'>
      <NavBar />

      <main className='mx-auto max-w-3xl px-4 pb-20 pt-28 md:px-6'>
        <h1 className='text-2xl font-black tracking-tight text-slate-900 sm:text-3xl'>
          Notifications
        </h1>
        <p className='mt-2 text-sm leading-7 text-slate-600'>
          Replies to your question reports, question fixes and new posts from
          the studio all land here.
        </p>

        <section className='mt-8'>
          <h2 className='text-xs font-bold uppercase tracking-[0.24em] text-slate-400'>
            Activity
          </h2>

          {items.length === 0 ? (
            <p className='mt-3 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500'>
              Nothing yet. Flag a question you think is wrong and you will get a
              reply here.
            </p>
          ) : (
            <div className='mt-3 space-y-2'>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border bg-white p-4 ${
                    item.read_at ? "border-slate-200" : "border-[#2660A4]/30"
                  }`}
                >
                  <div className='flex items-start gap-3'>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        item.read_at
                          ? "bg-slate-100 text-slate-400"
                          : "bg-[#2660A4]/10 text-[#2660A4]"
                      }`}
                    >
                      {iconFor(item.type)}
                    </span>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm font-bold text-slate-900'>{item.title}</p>
                      <p className='mt-1 text-sm leading-6 text-slate-600'>{item.body}</p>
                      <div className='mt-2 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400'>
                        <span>
                          {new Date(item.created_at).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {item.link && (
                          <Link
                            href={item.link}
                            className='text-[#2660A4] hover:underline'
                          >
                            Open
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className='mt-12'>
          <h2 className='text-xs font-bold uppercase tracking-[0.24em] text-slate-400'>
            Your question reports
          </h2>

          {myReports.length === 0 ? (
            <p className='mt-3 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500'>
              You have not reported any questions.
            </p>
          ) : (
            <div className='mt-3 space-y-3'>
              {myReports.map((report) => (
                <div
                  key={report.id}
                  className='rounded-2xl border border-slate-200 bg-white p-4'
                >
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600'>
                      {QUESTION_REPORT_STATUS_LABELS[report.status]}
                    </span>
                    <span className='text-[11px] font-semibold text-slate-400'>
                      {new Date(report.created_at).toLocaleDateString("en-GB")}
                    </span>
                  </div>

                  <p className='mt-2 line-clamp-2 text-sm font-semibold text-slate-800'>
                    {report.question_prompt}
                  </p>

                  {report.admin_reply ? (
                    <div className='mt-3 rounded-xl bg-[#1F8A70]/5 p-3'>
                      <p className='flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#166b56]'>
                        <MdCheckCircle size={12} /> Admin reply
                      </p>
                      <p className='mt-1 text-sm leading-6 text-slate-700'>
                        {report.admin_reply}
                      </p>
                    </div>
                  ) : (
                    <p className='mt-2 text-xs font-semibold text-slate-400'>
                      Awaiting review — you will be notified when an admin replies.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
