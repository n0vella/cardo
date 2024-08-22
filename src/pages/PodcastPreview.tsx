import { useLocation } from "react-router-dom";
import { EpisodeData, PodcastData, SortCriterion } from "..";
import { ReactNode, Suspense, useEffect, useState } from "react";
import * as icons from "../Icons"
import { parseXML } from "../utils";
import EpisodeCard from "../components/EpisodeCard";
import { useDB } from "../DB";
import { Switch, SwitchState } from "../components/Inputs";
import { usePodcastSettings } from "../Settings";
import { useTranslation } from "react-i18next";


function SortButton({ children, podcastUrl, criterion }: { children: ReactNode, podcastUrl: string, criterion: SortCriterion['criterion'] }) {
  const [{ current: { sort } }, updatePodcastSettings] = usePodcastSettings(podcastUrl)
  // podcastSettings.sort.criterion

  return (
    <button
      className={`bg-primary-8 hover:bg-primary-7 flex items-center justify-center w-2/3 rounded-md ${sort.criterion == criterion ? '.text-accent-6' : ''}`}
      onClick={
        () => {
          if (sort.criterion == criterion) {
            updatePodcastSettings({
              sort: {
                criterion,
                mode: sort.mode == 'asc' ? 'desc' : 'asc'
              }
            })
          } else {
            updatePodcastSettings({ sort: { criterion } })
          }
        }
      }
    >
      {
        sort.criterion == criterion &&
        <div className="w-5 h-5">
          {sort.mode === 'asc' ? icons.upArrow : icons.downArrow}
        </div>
      }
      {children}
    </button>
  )
}


function PodcastPreview() {
  const location = useLocation();
  const [imageError, setImageError] = useState(false)
  const podcast = location.state.podcast as PodcastData
  const [episodes, setEpisodes] = useState<EpisodeData[]>([])
  const [downloading, setDownloading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const { subscriptions: { getSubscription, deleteSubscription, addSubscription, reloadSubscriptions },
    history: { getCompletedEpisodes },
    subscriptionsEpisodes: { getAllSubscriptionsEpisodes, deleteSubscriptionEpisodes, saveSubscriptionsEpisodes } } = useDB()
  const [podcastSettings, updatePodcastSettings] = usePodcastSettings(podcast.feedUrl)
  podcastSettings.current

  const [tweakMenu, setTweakMenu] = useState<ReactNode>(undefined)
  const { t } = useTranslation()

  const sortEpisodes = (unsortedEpisodes: EpisodeData[]) => {
    const applyMode = (a: any, b: any) => {
      if (sortCriterion.mode === 'asc') {
        return a - b
      } else {
        return b - a
      }
    }

    let sortedEpisodes: EpisodeData[] = []
    const sortCriterion = podcastSettings.current.sort

    switch (sortCriterion.criterion) {
      case 'duration':
        sortedEpisodes = [...unsortedEpisodes].sort((a, b) => applyMode(a.duration, b.duration))
        break
      case 'date':
        sortedEpisodes = [...unsortedEpisodes].sort((a, b) => applyMode(a.pubDate, b.pubDate))
        break
    }

    return sortedEpisodes
  }

  const loadEpisodes = async (forceDownload = false) => {

    const downloadEpisodes = async () => {
      setDownloading(true)
      const [episodes, podcastDetails] = await parseXML(podcast.feedUrl)
      podcast.description = podcastDetails.description
      setDownloading(false)
      return episodes
    }

    const isSubscribed = await getSubscription(podcast.feedUrl) !== undefined
    setSubscribed(isSubscribed)

    let episodes: EpisodeData[] = []
    if (!isSubscribed || forceDownload) {
      episodes = await downloadEpisodes()
    } else if (isSubscribed) {
      episodes = await getAllSubscriptionsEpisodes({ podcastUrl: podcast.feedUrl })
      if (!episodes.length) {
        episodes = await downloadEpisodes()
      }
    }

    if (isSubscribed) {
      saveSubscriptionsEpisodes(episodes)
    }

    return sortEpisodes(await filterEpisodes(episodes))
  }

  const filterEpisodes = async (unfilteredEpisodes: EpisodeData[]) => {
    const completedEpisodes = await getCompletedEpisodes()
    const filter = podcastSettings.current.filter

    if (filter.played === SwitchState.True) {
      return unfilteredEpisodes.filter(ep => completedEpisodes.includes(ep.src))
    } else if (filter.played === SwitchState.False) {
      return unfilteredEpisodes.filter(ep => !completedEpisodes.includes(ep.src))
    } else {
      return unfilteredEpisodes
    }
  }

  useEffect(() => {
    loadEpisodes().then(episodes => setEpisodes(episodes))
    setTweakMenu(undefined)
  }, [podcast.feedUrl])


  useEffect(() => {
    setEpisodes(sortEpisodes(episodes))
  }, [podcastSettings.current?.sort.criterion, podcastSettings.current?.sort.mode])


  return (
    <div className="relative p-2 w-full flex flex-col">

      {tweakMenu &&
        <div className="left-1/2 -translate-x-1/2 absolute w-4/5 top-0 rounded-b-3xl overflow-hidden bg-primary-9 border-[1px] border-t-0 border-primary-6 flex flex-col justify-between items-center transition-all duration-200 z-20">
          <div className="p-2 flex flex-col gap-1 items-center w-full">
            {tweakMenu}
          </div>

          <button className="border-t-2 border-primary-8 p-2 h-5 w-4/5 flex justify-center items-center mt-1"
            onClick={() => setTweakMenu(undefined)}
          >
            <span className="h-6 w-6">{icons.upArrow}</span>
          </button>
        </div>
      }

      <div className='flex justify-left w-full gap-3 pb-3 border-b-[3px] border-primary-8 h-52'>
        <div className="flex flex-col gap-2 items-center shrink-0">
          {imageError ?
            icons.photo :
            <img
              className="bg-primary-7 h-40 aspect-square rounded-md"
              src={podcast.coverUrlLarge}
              alt=""
              onError={() => setImageError(true)}
            />}

          {/* #region BUTTONS */}
          <div className="flex gap-2">
            <button className="hover:text-accent-6" onClick={async () => {
              if (subscribed) {
                await deleteSubscription(podcast.feedUrl)
                setSubscribed(false)
                await deleteSubscriptionEpisodes(podcast.feedUrl)
              } else {
                podcast.id = await addSubscription(podcast)
                setSubscribed(true)
                await saveSubscriptionsEpisodes(episodes)
              }
              reloadSubscriptions()
            }}>
              {subscribed ? icons.starFilled : icons.star}
            </button>
            <button className="hover:text-accent-6" onClick={async () => {
              const [fetchedEpisodes,] = await parseXML(podcast.feedUrl)
              setEpisodes(sortEpisodes(fetchedEpisodes))
              saveSubscriptionsEpisodes(fetchedEpisodes)
            }
            }>
              {icons.reload}
            </button>

            <button
              className="hover:text-accent-6"
              onClick={() => {
                setTweakMenu(
                  <div className="w-4/5 flex flex-col gap-1 justify-center items-center">
                    <SortButton podcastUrl={podcast.feedUrl} criterion="date">
                      {t('date')}
                    </SortButton>
                    <SortButton podcastUrl={podcast.feedUrl} criterion="duration">
                      {t('duration')}
                    </SortButton>
                  </div>
                )
              }
              }>
              {icons.sort}
            </button>
            <button
              className="hover:text-accent-6"
              onClick={() => {
                setTweakMenu(
                  <div className="flex justify-center items-center">
                    <Switch initialState={podcastSettings.current.filter.played} setState={async (value) => {
                      updatePodcastSettings({ filter: { played: value } })
                      setEpisodes(await loadEpisodes())
                    }} labels={[t('not_played'), t('played')]} />
                  </div>
                )
              }
              }>
              {icons.filter}
            </button>
            <button className={`w-6 hover:text-accent-6 ${downloading
              && 'animate-[spin_2s_linear_reverse_infinite]'}`}
              onClick={async () => {
                setEpisodes(await loadEpisodes(true))
              }}
            >
              {icons.sync}
            </button>
          </div>
          {/* #endregion */}

        </div>

        <div className="flex flex-col h-full">
          <h1 className="text-lg">{podcast.podcastName}</h1>
          <h2 className="mb-2">{podcast.artistName}</h2>

          <div className="flex overflow-y-auto rounded-md scroll-smooth pr-2">
            <div className="whitespace-pre-line text-sm text-primary-4"
              dangerouslySetInnerHTML={{ __html: podcast.description ?? '' }} />
          </div>

        </div>
      </div >

      <div className="grid content-start">
        {episodes.map((episode, i) => (
          <Suspense key={i} fallback={<div className="bg-primary-8 h-20 w-full" />}>
            <EpisodeCard
              episode={episode}
              className="hover:bg-primary-8 transition-colors border-b-[1px] border-primary-8"
            />
          </Suspense>
        ))}
      </div>
    </div >
  )
}

export default PodcastPreview;