# @borealise/api

Official JavaScript/TypeScript API client for [Borealise](https://borealise.com).

## Installation

```bash
npm install @borealise/api axios
# or
yarn add @borealise/api axios
# or
pnpm add @borealise/api axios
```

> `axios` is a peer dependency — you need to install it alongside this package.

---

## Quick Start

Initialize the API client once (e.g. in your app entry point), then use the resource singletons anywhere.

```ts
import { Api, authResource, roomResource } from '@borealise/api'

// Initialize once
Api.getInstance({
  baseURL: 'https://prod.borealise.com',
})

// Login
const { data } = await authResource.login({ login: 'you@example.com', password: 'secret' })
Api.getInstance().setAuthToken(data.data.accessToken)

// Join a room
const room = await roomResource.join('chill-lounge')
```

---

## Configuration

```ts
Api.getInstance({
  baseURL: 'https://prod.borealise.com', // required
  timeout: 15000,                        // optional, default: 30000ms
  logging: false,                        // optional, disable all console output
})
```

---

## Resources

### Auth

```ts
import { authResource } from '@borealise/api'

await authResource.login({ login: 'user@example.com', password: '...' })
await authResource.register({ email, username, password, displayName })
await authResource.refresh(refreshToken)
await authResource.me()
await authResource.logout()
```

### Users

```ts
import { userResource } from '@borealise/api'

await userResource.getById(42)
await userResource.getByUsername('djname')
await userResource.updateProfile({ displayName: 'DJ Cool', bio: '...' })
await userResource.deleteAccount()
```

### Rooms

```ts
import { roomResource } from '@borealise/api'

await roomResource.list()
await roomResource.featured()
await roomResource.getBySlug('chill-lounge')
await roomResource.create({ slug: 'my-room', name: 'My Room' })
await roomResource.join('chill-lounge')
await roomResource.leave('chill-lounge')

// Waitlist
await roomResource.joinWaitlist('chill-lounge')
await roomResource.leaveWaitlist('chill-lounge')
await roomResource.lockWaitlist('chill-lounge')
await roomResource.unlockWaitlist('chill-lounge')

// Booth
await roomResource.getBooth('chill-lounge')
await roomResource.vote('chill-lounge', 'woot')
await roomResource.grabTrack('chill-lounge', playlistId)
await roomResource.skipTrack('chill-lounge')
```

### Playlists

```ts
import { playlistResource } from '@borealise/api'

await playlistResource.getAll()
await playlistResource.getById(1)
await playlistResource.create('My Playlist')
await playlistResource.rename(1, 'New Name')
await playlistResource.activate(1)
await playlistResource.shuffle(1)
await playlistResource.addItem(1, { source: 'youtube', sourceId: 'dQw4w9WgXcQ' })
await playlistResource.removeItem(1, itemId)
await playlistResource.moveItem(1, itemId, newPosition)
await playlistResource.importPlaylist(1, { url: 'https://youtube.com/playlist?list=...' })
await playlistResource.remove(1)
```

### Sources (Media Search)

```ts
import { sourceResource } from '@borealise/api'

await sourceResource.searchYouTube('lofi hip hop', 10)
await sourceResource.getYouTubeVideo('dQw4w9WgXcQ')
await sourceResource.searchSoundCloud('ambient', 10)
await sourceResource.getSoundCloudTrack('123456')
await sourceResource.resolveSoundCloudUrl('https://soundcloud.com/artist/track')

// Search both platforms at once
const results = await sourceResource.searchAll('chillwave')
```

### Chat

```ts
import { chatResource } from '@borealise/api'

await chatResource.getMessages('chill-lounge', beforeId, 50)
await chatResource.sendMessage('chill-lounge', { content: 'hello!' })
await chatResource.deleteMessage('chill-lounge', messageId)
```

---

## Error Handling

All methods throw `ApiError` on failure.

```ts
import { ApiError } from '@borealise/api'

try {
  await authResource.login({ login: 'bad', password: 'bad' })
} catch (err) {
  if (err instanceof ApiError) {
    console.log(err.message)   // Human-readable message from backend
    console.log(err.status)    // HTTP status code, e.g. 401
    console.log(err.code)      // Axios error code, e.g. 'NETWORK_ERROR'
    console.log(err.response)  // Raw backend error response body
  }
}
```

---

## Auth Token Management

```ts
const api = Api.getInstance()

// Set token after login
api.setAuthToken(accessToken)

// Clear token on logout
api.setAuthToken(null)
```

---

## TypeScript

All types are exported directly from the package:

```ts
import type {
  AuthUser,
  Room,
  RoomRole,
  ChatMessage,
  MediaItem,
  Playlist,
  MediaSearchResult,
  BoothState,
  WaitlistUser,
} from '@borealise/api'
```

---

## License

© [Borealise](https://borealise.com)
