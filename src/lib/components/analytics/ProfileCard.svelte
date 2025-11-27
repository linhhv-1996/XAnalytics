<script lang="ts">
    import type { Profile } from "$lib/types";
    export let profile: Profile;
</script>

<section class="b-card overflow-hidden">
    <div class="flex flex-col md:flex-row">
        <div
            class="p-5 md:w-[36%] border-b md:border-b-0 md:border-r border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 flex items-center gap-4"
        >
            <div class="relative">
                <img
                    src={profile.avatarUrl}
                    alt="avatar"
                    class="w-16 h-16 rounded-full border border-slate-700 object-cover bg-slate-900"
                />
                <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border border-slate-950 flex items-center justify-center shadow-[0_0_12px_rgba(52,211,153,0.9)]"
                >
                    <i class="fa-solid fa-check text-slate-950 text-[8px]"></i>
                </div>
            </div>
            <div>
                <h2 class="text-[15px] font-semibold text-slate-50 mb-1">
                    {profile.name}
                </h2>
                <p
                    class="inline-flex items-center gap-1 text-[12px] text-sky-400 font-mono px-2 py-0.5 rounded-full border border-slate-700 bg-slate-950/80"
                >
                    {profile.handle}
                </p>
            </div>
        </div>
        <div
            class="p-5 md:w-[64%] grid grid-cols-4 gap-4 text-[13px] bg-transparent"
        >
            <div>
                <p
                    class="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                >
                    Followers
                </p>
                <p class="text-[18px] font-semibold metric-num text-slate-50">
                    {profile.followers}
                </p>
            </div>
            <div>
                <p
                    class="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                >
                    Engagement
                </p>
                <p
                    class="text-[18px] font-semibold metric-num text-emerald-300"
                >
                    {profile.engagement}
                </p>
            </div>
            <div>
                <p
                    class="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                >
                    Viral ratio
                </p>
                <p class="text-[18px] font-semibold metric-num text-slate-50">
                    {profile.viralRatio}
                </p>
            </div>
            <div>
                <p
                    class="text-[10px] uppercase tracking-wide text-slate-400 mb-1"
                >
                    Overall grade
                </p>
                <p class="text-[18px] font-semibold metric-num text-slate-50">
                    {profile.grade}
                </p>
            </div>
        </div>
    </div>
</section>
