'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Music,
  Share2,
  CalendarCheck,
  Megaphone,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { VideoItem, MusicTrackItem, RewardTask, CampaignItem, TaskCompletion } from '@/lib/types';
import { formatKwanza } from '@/lib/finance-engine';

interface RewardsViewProps {
  initialSubTab?: string;
  videos: VideoItem[];
  music: MusicTrackItem[];
  tasks: RewardTask[];
  campaigns: CampaignItem[];
  completions: TaskCompletion[];
  onCompleteMedia: (type: 'video' | 'music', id: string, duration: number) => { rewardAOA: number; rewardPoints: number; message: string };
  onCompleteGenericTask: (taskId: string) => { rewardAOA: number; rewardPoints: number; message: string };
}

export function RewardsView({
  initialSubTab = 'videos',
  videos,
  music,
  tasks,
  campaigns,
  completions,
  onCompleteMedia,
  onCompleteGenericTask,
}: RewardsViewProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'music' | 'share' | 'daily' | 'campaigns'>(
    (initialSubTab as any) || 'videos'
  );

  // Video Player state
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [videoTimer, setVideoTimer] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoRewardClaimed, setVideoRewardClaimed] = useState<boolean>(false);

  // Music Player state
  const [selectedMusic, setSelectedMusic] = useState<MusicTrackItem | null>(null);
  const [musicTimer, setMusicTimer] = useState<number>(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Feedback banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync initialSubTab when it changes
  useEffect(() => {
    if (initialSubTab && ['videos', 'music', 'share', 'daily', 'campaigns'].includes(initialSubTab)) {
      setActiveTab(initialSubTab as any);
    }
  }, [initialSubTab]);

  // Video watch timer effect
  useEffect(() => {
    let interval: any;
    if (isVideoPlaying && selectedVideo && !videoRewardClaimed) {
      interval = setInterval(() => {
        setVideoTimer((prev) => {
          const next = prev + 1;
          if (next >= selectedVideo.minWatchSeconds && !videoRewardClaimed) {
            // Can claim
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying, selectedVideo, videoRewardClaimed]);

  // Music play timer effect
  useEffect(() => {
    let interval: any;
    if (isMusicPlaying && selectedMusic) {
      interval = setInterval(() => {
        setMusicTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMusicPlaying, selectedMusic]);

  // Check if item is already completed today
  const isItemCompleted = (id: string) => {
    return completions.some((c) => c.taskId === id);
  };

  // Video Claim Handler
  const handleClaimVideoReward = (video: VideoItem) => {
    setErrorMessage(null);
    setToastMessage(null);
    try {
      const res = onCompleteMedia('video', video.id, videoTimer);
      setVideoRewardClaimed(true);
      setIsVideoPlaying(false);
      setToastMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar recompensa.');
    }
  };

  // Music Claim Handler
  const handleClaimMusicReward = (track: MusicTrackItem) => {
    setErrorMessage(null);
    setToastMessage(null);
    try {
      const res = onCompleteMedia('music', track.id, musicTimer);
      setIsMusicPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setToastMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar recompensa.');
    }
  };

  // Share Intent Simulation (WhatsApp)
  const handleShareOnWhatsApp = (task: RewardTask) => {
    setErrorMessage(null);
    setToastMessage(null);
    const text = encodeURIComponent(
      `Conheça a Angoepo Rewards! Ganhe Kz em Angola assistindo a vídeos e ouvindo músicas: https://angoepo.ao/rewards`
    );
    // Direct WhatsApp share url
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');

    setTimeout(() => {
      try {
        const res = onCompleteGenericTask(task.id);
        setToastMessage(`Partilha verificada! ${res.message}`);
      } catch (err: any) {
        setErrorMessage(err.message);
      }
    }, 1500);
  };

  // Daily / Questionario Task Handler
  const handleCompleteGeneric = (task: RewardTask) => {
    setErrorMessage(null);
    setToastMessage(null);
    try {
      const res = onCompleteGenericTask(task.id);
      setToastMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Assistir a Vídeos ({videos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('music')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'music'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Ouvir Músicas ({music.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('share')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'share'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Partilhar Conteúdos</span>
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'daily'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Tarefas Diárias</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'campaigns'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Campanhas ({campaigns.length})</span>
        </button>
      </div>

      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-700 hover:text-red-900">
            ✕
          </button>
        </div>
      )}

      {/* --- CATEGORIA A: ASSISTIR A VÍDEOS --- */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Visualização Remunerada Segura</h4>
              <p className="mt-0.5 text-blue-800 leading-relaxed">
                Assista ao vídeo durante pelo menos o tempo mínimo indicado. A recompensa em Kwanza é creditada de forma automática no servidor assim que o cronómetro for concluído. Uma recompensa diária por vídeo.
              </p>
            </div>
          </div>

          {/* Active Video Player Modal/Display if Selected */}
          {selectedVideo && (
            <div className="rounded-3xl bg-slate-950 text-white p-5 sm:p-6 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    Sessão Activa de Vídeo
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedVideo(null);
                    setIsVideoPlaying(false);
                    setVideoTimer(0);
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Fechar Player ✕
                </button>
              </div>

              {/* Video Frame */}
              <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center">
                <iframe
                  src={`${selectedVideo.videoUrl}?autoplay=${isVideoPlaying ? '1' : '0'}`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Player Controls & Validation Timer */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedVideo.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Canal: {selectedVideo.channelName}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">
                      +{formatKwanza(selectedVideo.rewardAOA)} ({selectedVideo.rewardPoints} pts)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Timer display */}
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                      Tempo Assistido
                    </span>
                    <span className="text-base font-mono font-extrabold text-blue-400">
                      {videoTimer}s / {selectedVideo.minWatchSeconds}s
                    </span>
                  </div>

                  {/* Play / Pause toggle */}
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                    title={isVideoPlaying ? 'Pausar' : 'Reproduzir'}
                  >
                    {isVideoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>

                  {/* Validate / Claim button */}
                  <button
                    onClick={() => handleClaimVideoReward(selectedVideo)}
                    disabled={videoTimer < selectedVideo.minWatchSeconds || videoRewardClaimed}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-lg ${
                      videoTimer >= selectedVideo.minWatchSeconds && !videoRewardClaimed
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-900/50'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {videoRewardClaimed
                        ? 'Recompensa Paga!'
                        : videoTimer >= selectedVideo.minWatchSeconds
                        ? 'Validar Recompensa'
                        : `Aguarde ${selectedVideo.minWatchSeconds - videoTimer}s`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => {
              const completed = isItemCompleted(video.id);
              return (
                <div
                  key={video.id}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-slate-900 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                      <button
                        onClick={() => {
                          setSelectedVideo(video);
                          setVideoTimer(0);
                          setIsVideoPlaying(true);
                          setVideoRewardClaimed(completed);
                        }}
                        className="w-12 h-12 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition cursor-pointer"
                        title="Assistir Vídeo"
                      >
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </button>
                    </div>

                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-white font-bold text-[10px]">
                      {video.category}
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[11px] font-mono">
                      Mín: {video.minWatchSeconds}s
                    </span>

                    {completed && (
                      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <CheckCircle2 className="w-4 h-4" />
                          Concluído Hoje (+{formatKwanza(video.rewardAOA)})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Canal: <span className="font-semibold">{video.channelName}</span> • {video.viewsCount} visualizações
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black text-emerald-600">
                          +{formatKwanza(video.rewardAOA)}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          ({video.rewardPoints} pts)
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedVideo(video);
                          setVideoTimer(0);
                          setIsVideoPlaying(true);
                          setVideoRewardClaimed(completed);
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          completed
                            ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{completed ? 'Assistir Novamente' : 'Iniciar Reprodução'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- CATEGORIA B: OUVIR MÚSICAS --- */}
      {activeTab === 'music' && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-xs text-purple-900 flex items-start gap-3">
            <Music className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Biblioteca de Músicas Angolanas Licenciadas</h4>
              <p className="mt-0.5 text-purple-800 leading-relaxed">
                Apoie os artistas de Angola ouvindo faixas autorizadas de Semba, Kizomba, Kuduro e Afro House. Ouça pelo menos o tempo mínimo para desbloquear a recompensa em Kwanza.
              </p>
            </div>
          </div>

          {/* Active Audio Player Deck if Selected */}
          {selectedMusic && (
            <div className="rounded-3xl bg-slate-900 text-white p-5 border border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <audio
                ref={audioRef}
                src={selectedMusic.audioPreviewUrl}
                onEnded={() => setIsMusicPlaying(false)}
                muted={isMuted}
              />
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-slate-700 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedMusic.coverArtUrl}
                    alt={selectedMusic.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-400">
                    A Reproduzir • {selectedMusic.genre}
                  </span>
                  <h3 className="font-extrabold text-sm text-white">{selectedMusic.title}</h3>
                  <p className="text-xs text-slate-400">{selectedMusic.artist} — {selectedMusic.album}</p>
                </div>
              </div>

              {/* Waveform Animation Simulation */}
              <div className="flex items-center gap-1 h-8">
                {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 30, 75, 60, 85].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: isMusicPlaying ? `${h}%` : '20%' }}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isMusicPlaying ? 'bg-purple-500' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title={isMuted ? 'Desmutar' : 'Mutar'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    if (isMusicPlaying) {
                      audioRef.current?.pause();
                      setIsMusicPlaying(false);
                    } else {
                      audioRef.current?.play();
                      setIsMusicPlaying(true);
                    }
                  }}
                  className="p-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-900/50 cursor-pointer"
                >
                  {isMusicPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <div className="text-right">
                  <span className="block text-[10px] text-slate-400">Tempo Ouvido</span>
                  <span className="text-xs font-mono font-bold text-purple-400">
                    {musicTimer}s / {selectedMusic.minListenSeconds}s
                  </span>
                </div>

                <button
                  onClick={() => handleClaimMusicReward(selectedMusic)}
                  disabled={musicTimer < selectedMusic.minListenSeconds || isItemCompleted(selectedMusic.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition shadow-md ${
                    musicTimer >= selectedMusic.minListenSeconds && !isItemCompleted(selectedMusic.id)
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  {isItemCompleted(selectedMusic.id)
                    ? 'Concluído'
                    : musicTimer >= selectedMusic.minListenSeconds
                    ? 'Resgatar Recompensa'
                    : `Faltam ${selectedMusic.minListenSeconds - musicTimer}s`}
                </button>
              </div>
            </div>
          )}

          {/* Music Track List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {music.map((track) => {
              const completed = isItemCompleted(track.id);
              return (
                <div
                  key={track.id}
                  className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={track.coverArtUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setSelectedMusic(track);
                          setMusicTimer(0);
                          setIsMusicPlaying(true);
                          setTimeout(() => audioRef.current?.play(), 100);
                        }}
                        className="absolute inset-0 bg-slate-950/40 hover:bg-slate-950/20 flex items-center justify-center text-white transition cursor-pointer"
                        title="Ouvir Faixa"
                      >
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </button>
                    </div>

                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {track.genre}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {track.artist} • Mín. {track.minListenSeconds}s
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-600">
                      +{formatKwanza(track.rewardAOA)}
                    </div>
                    <div className="text-[10px] text-slate-400">{track.rewardPoints} pts</div>
                    {completed ? (
                      <span className="inline-block mt-1 text-[10px] text-emerald-600 font-bold">
                        ✓ Ouvido
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedMusic(track);
                          setMusicTimer(0);
                          setIsMusicPlaying(true);
                          setTimeout(() => audioRef.current?.play(), 100);
                        }}
                        className="mt-1 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Ouvir
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- CATEGORIA C: PARTILHAR CONTEÚDOS --- */}
      {activeTab === 'share' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
            <Share2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Partilha Responsável e Autêntica</h4>
              <p className="mt-0.5 text-emerald-800 leading-relaxed">
                Partilhe campanhas oficiais da Angoepo nos seus estados do WhatsApp, grupos de amigos ou redes sociais. Não remuneramos apenas cliques em branco: cada partilha gera um link legítimo rastreado.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks
              .filter((t) => t.category === 'share')
              .map((task) => {
                const completed = isItemCompleted(task.id);
                return (
                  <div
                    key={task.id}
                    className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Partilha Aprovada
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          +{formatKwanza(task.rewardAOA)} ({task.rewardPoints} pts)
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{task.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {task.description}
                      </p>

                      <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] space-y-1">
                        <span className="font-bold text-slate-700 block">Instruções:</span>
                        {task.instructions.map((inst, i) => (
                          <div key={i} className="text-slate-500 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-slate-400" />
                            <span>{inst}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {task.totalCompletions} pessoas já partilharam
                      </span>
                      <button
                        onClick={() => handleShareOnWhatsApp(task)}
                        disabled={completed}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                          completed
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md'
                        }`}
                      >
                        <Share2 className="w-4 h-4" />
                        <span>{completed ? 'Já Partilhado Hoje' : 'Partilhar no WhatsApp'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* --- CATEGORIA D: TAREFAS DIÁRIAS & QUESTIONÁRIOS --- */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks
              .filter((t) => t.category === 'daily' || t.category === 'campaign')
              .map((task) => {
                const completed = isItemCompleted(task.id);
                return (
                  <div
                    key={task.id}
                    className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {task.category === 'daily' ? 'Diária' : 'Questionário'}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          +{formatKwanza(task.rewardAOA)} ({task.rewardPoints} pts)
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{task.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {task.description}
                      </p>

                      <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] space-y-1">
                        <span className="font-bold text-slate-700 block">Como realizar:</span>
                        {task.instructions.map((inst, i) => (
                          <div key={i} className="text-slate-500 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-slate-400" />
                            <span>{inst}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Limite: 1x ao dia
                      </span>
                      <button
                        onClick={() => handleCompleteGeneric(task)}
                        disabled={completed}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          completed
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-md'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{completed ? 'Concluída Hoje' : 'Completar Actividade'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* --- CATEGORIA E: CAMPANHAS PATROCINADAS --- */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 flex items-start gap-3">
            <Megaphone className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Campanhas Oficiais Patrocinadas</h4>
              <p className="mt-0.5 text-rose-800 leading-relaxed">
                Todas as recompensas são 100% financiadas pelos orçamentos reais das marcas parceiras de Angola. Nenhuma recompensa é criada sem fundos reais em tesouraria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative h-44 bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={camp.bannerUrl}
                    alt={camp.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Patrocinador: {camp.sponsorName}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black shadow-lg">
                    +{formatKwanza(camp.rewardPerUserAOA)} por pessoa
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{camp.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {camp.description}
                    </p>

                    {/* Budget & Participation Progress */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Participantes:</span>
                        <span className="font-bold text-slate-900">
                          {camp.currentParticipants} / {camp.maxParticipants}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          style={{
                            width: `${(camp.currentParticipants / camp.maxParticipants) * 100}%`,
                          }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Orçamento Restante:</span>
                        <span className="font-semibold text-emerald-700">
                          {formatKwanza(camp.remainingBudgetAOA)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Válido até: {new Date(camp.endDate).toLocaleDateString('pt-AO')}
                    </span>
                    <button
                      onClick={() => {
                        setToastMessage(
                          `Participação na campanha "${camp.title}" registada! Foram creditados ${camp.rewardPerUserAOA} Kz.`
                        );
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      Participar Agora
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
