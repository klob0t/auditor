'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Spinner from '@/app/components/spinner'
import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'

const TRANSPARENT_PLACEHOLDER =
   'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

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

const mockTopArtists: Artist[] = [
   { name: 'Tame Impala', external_urls: { spotify: '#' }, images: [{ url: 'https://placehold.co/300.png' }] },
   { name: 'Kendrick Lamar', external_urls: { spotify: '#' }, images: [{ url: 'https://placehold.co/300.png' }] },
   { name: 'Phoebe Bridgers', external_urls: { spotify: '#' }, images: [{ url: 'https://placehold.co/300.png' }] },
   { name: 'Frank Ocean', external_urls: { spotify: '#' }, images: [{ url: 'https://placehold.co/300.png' }] },
   { name: 'Radiohead', external_urls: { spotify: '#' }, images: [{ url: 'https://placehold.co/300.png' }] },
]

const mockTopTracks: Track[] = [
   { name: 'Let It Happen', artists: [{ name: 'Tame Impala', external_urls: { spotify: '#' } }], album: { images: [{ url: 'https://placehold.co/300.png' }] }, external_urls: { spotify: '#' } },
   { name: 'Money Trees', artists: [{ name: 'Kendrick Lamar', external_urls: { spotify: '#' } }], album: { images: [{ url: 'https://placehold.co/300.png' }] }, external_urls: { spotify: '#' } },
   { name: 'Motion Sickness', artists: [{ name: 'Phoebe Bridgers', external_urls: { spotify: '#' } }], album: { images: [{ url: 'https://placehold.co/300.png' }] }, external_urls: { spotify: '#' } },
   { name: 'Pyramids', artists: [{ name: 'Frank Ocean', external_urls: { spotify: '#' } }], album: { images: [{ url: 'https://placehold.co/300.png' }] }, external_urls: { spotify: '#' } },
   { name: 'Weird Fishes/Arpeggi', artists: [{ name: 'Radiohead', external_urls: { spotify: '#' } }], album: { images: [{ url: 'https://placehold.co/300.png' }] }, external_urls: { spotify: '#' } },
]


export default function ProfilePage() {
   // const { data: session, status } = useSession()
   // const router = useRouter()

   // const [topTracks, setTopTracks] = useState<Track[]>([])
   // const [topArtists, setTopArtists] = useState<Artist[]>([])
   // const [isLoading, setIsLoading] = useState(true)
   // const [error, setError] = useState<string | null>(null)

   // useEffect(() => {
   //    if (status === 'loading') {
   //       return
   //    }

   //    if (status === 'unauthenticated') {
   //       router.push('/')
   //       return
   //    }

   //    const getSpotifyData = async () => {
   //       if (!session?.accessToken) return
   //       setIsLoading(true)
   //       setError(null)

   //       try {
   //          const fetchTopItems = async (type: 'tracks' | 'artists') => {
   //             const response = await fetch(`https://api.spotify.com/v1/me/top/$${type}?time_range=medium_term&imit=10`, {
   //                headers: {
   //                   Authorization: `Bearer ${session.accessToken}`,
   //                },
   //             })

   //             if (!response.ok) {
   //                throw new Error(`Failed to fetch top ${type}. Status: ${response.status}`)
   //             }
   //             const data = await response.json()
   //             return data.items
   //          }

   //          const [tracks, artists] = await Promise.all([
   //             fetchTopItems('tracks'),
   //             fetchTopItems('artists'),
   //          ])

   //          setTopTracks(tracks)
   //          setTopArtists(artists)
   //       } catch (err: any) {
   //          console.error(err)
   //          setError('Could not load your Spotify data. Please try logging in again.')
   //       } finally {
   //          setIsLoading(false)
   //       }
   //    }

   //    getSpotifyData()
   // }, [session, status, router])

   // if (isLoading || status === 'loading') {
   //    return (
   //       <div
   //          style={{
   //             display: 'flex',
   //             justifyContent: 'center',
   //             alignItems: 'center',
   //             height: '100vh'
   //          }}>
   //          <Spinner size={60} />
   //       </div>
   //    )
   // }

   // if (error) {
   //    return (
   //       <div
   //          style={{
   //             textAlign: 'center',
   //             paddingTop: '50px'
   //          }}>
   //          <h2>Something went wrong</h2>
   //          <p>{error}</p>
   //          <button onClick={() => signOut({ callbackUrl: '/' })}>Try log in again</button>
   //       </div>
   //    )
   // }

   return (
      <div className={styles.profileBackground}>
      <div className={styles.profileContainer}>
          <div className={styles.header}>
               <span>Airlangga,</span>
            </div>
         <div className={styles.sectionContainer}>
            <div className={styles.roastContainer}>
            <span className={styles.quote}>"</span>
               <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><span className={styles.quote}>"</span>
            </div>
         </div>
         <div className={styles.header}>
               <span>Your Profile</span>
            </div>
         <div className={styles.sectionContainer}>
            <h2>Top Artists</h2>
            <div className={styles.listContainer}>
               {mockTopArtists.map((artist, i) => (
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
               {mockTopTracks.map((track, i) => (
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
      </div>
   )
}