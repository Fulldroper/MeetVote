import { hasSupabase, supabase } from '../lib/supabase'
import type { Poll, Vote } from '../composables/useApp'

/**
 * Supabase schema (run as SQL in Supabase dashboard):
 *
 *   create table polls (
 *     id uuid primary key,
 *     title text not null,
 *     description text default '',
 *     timezone text default 'Europe/Kyiv',
 *     start_date date not null,
 *     end_date date not null,
 *     end_at timestamptz not null,
 *     interval_minutes int not null default 60,
 *     allow_edit boolean default true,
 *     status text default 'live',
 *     created_at timestamptz default now()
 *   );
 *
 *   create table votes (
 *     id uuid primary key,
 *     poll_id uuid references polls(id) on delete cascade,
 *     nickname text not null,
 *     edit_token text not null,
 *     slots jsonb not null,
 *     created_at timestamptz default now()
 *   );
 *
 *   alter table polls enable row level security;
 *   alter table votes enable row level security;
 *   create policy "polls_read"  on polls for select using (true);
 *   create policy "polls_write" on polls for insert with check (true);
 *   create policy "votes_read"  on votes for select using (true);
 *   create policy "votes_write" on votes for insert with check (true);
 */

const pollToRow = (poll: Poll) => ({
  id: poll.id,
  title: poll.title,
  description: poll.description,
  timezone: poll.timezone,
  start_date: poll.startDate,
  end_date: poll.endDate,
  end_at: poll.endAt,
  interval_minutes: poll.intervalMinutes,
  allow_edit: poll.allowEdit,
  status: poll.status,
})

const rowToPoll = (row: Record<string, unknown>): Poll => ({
  id: String(row.id),
  title: String(row.title ?? ''),
  description: String(row.description ?? ''),
  timezone: String(row.timezone ?? 'Europe/Kyiv'),
  startDate: String(row.start_date ?? ''),
  endDate: String(row.end_date ?? ''),
  endAt: String(row.end_at ?? ''),
  intervalMinutes: Number(row.interval_minutes ?? 60),
  allowEdit: Boolean(row.allow_edit ?? true),
  showLiveResults: true,
  anonymous: false,
  autoClose: true,
  status: (row.status as 'live' | 'closed') ?? 'live',
})

const voteToRow = (pollId: string, vote: Vote) => ({
  id: vote.id,
  poll_id: pollId,
  nickname: vote.nickname,
  edit_token: vote.editToken,
  slots: vote.slots,
})

const rowToVote = (row: Record<string, unknown>): Vote => ({
  id: String(row.id),
  nickname: String(row.nickname ?? ''),
  comment: '',
  editToken: String(row.edit_token ?? ''),
  slots: (row.slots as Vote['slots']) ?? [],
})

export const createPollRemote = async (poll: Poll): Promise<Poll> => {
  if (!hasSupabase()) return poll
  const { data, error } = await supabase()
    .from('polls')
    .insert(pollToRow(poll))
    .select()
    .single()
  if (error) throw error
  return rowToPoll(data)
}

export const fetchPollRemote = async (id: string): Promise<Poll | null> => {
  if (!hasSupabase()) return null
  const { data, error } = await supabase().from('polls').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? rowToPoll(data) : null
}

export const submitVoteRemote = async (pollId: string, vote: Vote): Promise<void> => {
  if (!hasSupabase()) return
  const { error } = await supabase().from('votes').insert(voteToRow(pollId, vote))
  if (error) throw error
}

export const updateVoteRemote = async (pollId: string, vote: Vote): Promise<void> => {
  if (!hasSupabase()) return
  const { error } = await supabase()
    .from('votes')
    .update(voteToRow(pollId, vote))
    .eq('id', vote.id)
  if (error) throw error
}

export const fetchVotesRemote = async (pollId: string): Promise<Vote[]> => {
  if (!hasSupabase()) return []
  const { data, error } = await supabase()
    .from('votes')
    .select('*')
    .eq('poll_id', pollId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToVote)
}
