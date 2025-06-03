//@/app/profile/index.tsx
'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Markdown from 'markdown-to-jsx'
import Spinner from '@/app/components/spinner'
import styles from './page.module.css'
import Image from 'next/image'
import { fetchSpotifyProfile, fetchTopSpotifyItems } from '@/app/lib/spotify'
import { getRating } from '@/app/lib/payload'

const TRANSPARENT_PLACEHOLDER =
   'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'


//*----Interfaces

interface Artist {
   name: string
   external_urls: { spotify: string }
   images?: { url: string }[]
}

interface Track {
   name: string
   artists: Artist[]
   album: {
      images: { url: string }[]
   }
   external_urls: { spotify: string }
}

export default function ProfilePage() {
   const { data: session, status } = useSession()
   const router = useRouter()

   const [topTracks, setTopTracks] = useState<Track[]>([])
   const [topArtists, setTopArtists] = useState<Artist[]>([])
   const [isLoading, setIsLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   const [rating, setRating] = useState('')
   const [isRatingLoading, setIsRatingLoading] = useState(false)

   const [userName, setUserName] = useState('')

   const captureRef = useRef<HTMLDivElement>(null)

   // const fetchRating = async (tracks: Track[], artists: Artist[], username: string) => {
   //    if (tracks.length === 0 && artists.length === 0) {
   //       setRating('Not enough listening data to generate a rating. Please come back again after you listen to more music!')
   //       return
   //    }
   //    setIsRatingLoading(true)
   //    setRating('')

   //    try {
   //       const response = await fetch('/api/pollinations', {
   //          method: 'POST',
   //          headers: { 'Content-Type': 'application/json' },
   //          body: JSON.stringify({
   //             tracks,
   //             artists,
   //             username
   //          }),
   //       })
   //       if (!response.ok) {
   //          const errData = await response.json()
   //          throw new Error(errData.error || "The server is under maintenance.")
   //       }
   //       const data = await response.json()
   //       setRating(data.rating)
   //    } catch (err: any) {
   //       console.error('Error fetching the rating: ', err)
   //       setRating(`Error generating the rating: ${err.message}`)
   //    } finally {
   //       setIsRatingLoading(false)
   //    }
   // }

   useEffect(() => {
      if (status === 'loading') {
         return
      }

      if (status === 'unauthenticated') {
         router.push('/')
         return
      }

      const loadData = async () => {
         if (!session?.accessToken) {
            setError('Authentication issue: Access token missing. Please try signing in again.')
            setIsLoading(false)
            return
         }

         try {
            setIsLoading(true)
            setError(null)

            const profileData = await fetchSpotifyProfile(session.accessToken)
            setUserName(profileData.display_name)

            const [tracks, artists] = await Promise.all([
               fetchTopSpotifyItems(session.accessToken, 'tracks'),
               fetchTopSpotifyItems(session.accessToken, 'artists')
            ])

            setTopTracks(tracks)
            setTopArtists(artists)

            if (tracks.length > 0 || artists.length > 0) {
               const ratingResult = await getRating(tracks, artists, profileData.display_name)
               setRating(ratingResult)
            } else {
               return setRating('Listening data is not enough to generate rating. Please come back again after you listen to more music!')
            }
         } catch (err: any) {
            console.error(err)
            setError('Could not load your Spotify data. Please try logging in again.')
         } finally {
            setIsLoading(false)
         }
      }

      loadData()
   }, [session, status, router])

   if (isLoading || status === 'loading') {
      return (
         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               height: '100vh'
            }}>
            <Spinner size={40} />
         </div>
      )
   }

   if (error) {
      return (
         <div className={styles.error}>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button onClick={() => signOut({ callbackUrl: '/' })}>Try log in again</button>
         </div>
      )
   }

   return (
      <div className={styles.profileContainer}>
         <div className={styles.sectionContainer}>
            <div className={styles.auditor}><span>The Auditor:</span></div>
            <div className={styles.roastContainer}>
               <Markdown>
                  {rating}
               </Markdown>
            </div>
         </div>
         <div className={styles.header}>
            <div className={styles.hrWrapper}>
               <hr className={styles.hr} />
               <span className={styles.text}>Your Profile</span>
               <hr className={styles.hr} />
            </div>
         </div>
         <div className={styles.sectionContainer}>
            <h2>Top Artists</h2>
            <div className={styles.listContainer}>
               {topArtists.map((artist, i) => (
                  <div key={i} className={styles.listItem}>
                     <span className={styles.listItemRank}>{i + 1}</span>
                     <div className={styles.listItemImageWrapper}>
                        <Image
                           src={artist.images?.[0]?.url ?? TRANSPARENT_PLACEHOLDER}
                           alt={`Profile picture for ${artist.name}`}
                           fill
                        />
                     </div>
                     <span className={styles.listItemName}>{artist.name}</span>
                  </div>
               ))}
            </div>
         </div>
         <div className={styles.sectionContainer}>
            <h2>Top Tracks</h2>
            <div className={styles.listContainer}>
               {topTracks.map((track, i) => (
                  <div key={i} className={styles.listItem}>
                     <span className={styles.listItemRank}>{i + 1}</span>
                     <div className={styles.listItemImageWrapperSquare}>
                        <Image
                           src={track.album.images[0].url}
                           alt={`Album art for ${track.name}`}
                           fill
                        />
                     </div>
                     <div className={styles.listItemTextContainer}>
                        <span className={styles.trackTitle}>{track.name}</span>
                        <span className={styles.artistName}>
                           {track.artists.map(artist => artist.name).join(', ')}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className={styles.shareButtons}>
            <div className={styles.instagram}></div>
            <div className={styles.download}></div>
         </div>
      </div>
   )
}