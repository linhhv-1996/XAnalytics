<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    import { createEventDispatcher } from 'svelte';


    export let profile: AnalyticsData['profile'];

    const dispatch = createEventDispatcher();
</script>

<div class="space-y-4">
    <div class="card flex flex-col overflow-hidden">
        <div class="h-20 w-full bg-gradient-to-r from-slate-900 to-slate-700 relative" 
             style={profile.banner ? `background-image: url('${profile.banner}'); background-size: cover;` : ''}>
             {#if profile.banner}<div class="absolute inset-0 bg-black/10"></div>{/if}
        </div>
        
        <div class="px-4 pb-4 -mt-10 flex-1 flex flex-col relative z-10">
            <div class="flex justify-between items-end">
                <img src={profile.avatarUrl.replace('_normal', '_400x400')} class="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover bg-white" alt="{profile.name}">
                <span class="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-200 uppercase tracking-wide mb-1">{profile.grade} Tier</span>
            </div>
            <div class="mt-3">
                <h2 class="flex items-center gap-1.5 text-[15px] font-semibold text-slate-900">
                    {profile.name} <i class="fa-solid fa-certificate text-sky-500 text-[11px]"></i>
                </h2>
                <div class="text-[11px] text-slate-500 font-mono mt-0.5">{profile.handle}</div>
            </div>
            <p class="mt-2 text-[11px] text-slate-600 leading-relaxed line-clamp-3">{@html profile.bio}</p>
            <div class="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                <div><div class="text-[13px] font-mono font-semibold text-slate-900">{profile.following}</div><div class="text-[10px] uppercase tracking-wide text-slate-500">Following</div></div>
                <div><div class="text-[13px] font-mono font-semibold text-slate-900">{profile.followers}</div><div class="text-[10px] uppercase tracking-wide text-slate-500">Followers</div></div>
                <div><div class="text-[13px] font-mono font-semibold text-slate-900">{profile.tweetsCount}</div><div class="text-[10px] uppercase tracking-wide text-slate-500">Posts</div></div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100">
                <button 
                    on:click={() => dispatch('openRelationship')}
                    class="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all text-[11px] font-bold uppercase tracking-wider group"
                >
                    <i class="fa-solid fa-fingerprint text-indigo-500 group-hover:scale-110 transition-transform"></i>
                    <span>Check Relationship with You</span>
                </button>
            </div>

        </div>
    </div>
</div>
