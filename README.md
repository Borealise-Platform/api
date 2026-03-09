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

### Option 1: Pre-configured Client (Recommended)

Create a client once, then use resources:

```ts
import { createApiClient } from '@borealise/api'

const client = createApiClient({
  baseURL: 'https://prod.borealise.com',
})

// Login
const { data } = await client.auth.login({ login: 'you@example.com', password: 'secret' })
client.api.setAuthToken(data.data.accessToken)

// Join a room
const room = await client.room.join('chill-lounge')
```

### Option 2: Custom API Instance

If you need more control, create the API and resources separately:

```ts
import { createApi, createAuthResource, createRoomResource } from '@borealise/api'

const api = createApi({
  baseURL: 'https://prod.borealise.com',
  timeout: 15000,
  logging: false,
})

const auth = createAuthResource(api)
const room = createRoomResource(api)

// Use custom instances
await auth.login({ login: 'you@example.com', password: 'secret' })
```

---

## Configuration

```ts
createApiClient({
  baseURL: 'https://prod.borealise.com', // required
  timeout: 15000,                        // optional, default: 30000ms
  logging: false,                         // optional, disable all console output
  headers: { 'X-Custom-Header': 'value' } // optional, custom headers
})
```

---

## Resources

All resources are accessed via the client:

### Auth

```ts
const { auth } = createApiClient({ baseURL: '...' })

await auth.login({ login: 'user@example.com', password: '...' })
await auth.register({ email, username, password, displayName })
await auth.refresh(refreshToken)
await auth.me()
await auth.logout()
```

### Users

```ts
const { user } = createApiClient({ baseURL: '...' })

await user.getById(42)
await user.getByUsername('djname')
await user.updateProfile({ displayName: 'DJ Cool', bio: '...' })
await user.deleteAccount()
```

### Rooms

```ts
const { room } = createApiClient({ baseURL: '...' })

await room.list()
await room.featured()
await room.getBySlug('chill-lounge')
await room.create({ slug: 'my-room', name: 'My Room' })
await room.join('chill-lounge')
await room.leave('chill-lounge')

// Waitlist
await room.joinWaitlist('chill-lounge')
await room.leaveWaitlist('chill-lounge')
await room.lockWaitlist('chill-lounge')
await room.unlockWaitlist('chill-lounge')

// Booth
await room.getBooth('chill-lounge')
await room.vote('chill-lounge', 'woot')
await room.grabTrack('chill-lounge', playlistId)
await room.skipTrack('chill-lounge')
```

### Playlists

```ts
const { playlist } = createApiClient({ baseURL: '...' })

await playlist.getAll()
await playlist.getById(1)
await playlist.create('My Playlist')
await playlist.rename(1, 'New Name')
await playlist.activate(1)
await playlist.shuffle(1)
await playlist.addItem(1, { source: 'youtube', sourceId: 'dQw4w9WgXcQ' })
await playlist.removeItem(1, itemId)
await playlist.moveItem(1, itemId, newPosition)
await playlist.importPlaylist(1, { url: 'https://youtube.com/playlist?list=...' })
await playlist.remove(1)
```

### Sources (Media Search)

```ts
const { source } = createApiClient({ baseURL: '...' })

await source.searchYouTube('lofi hip hop', 10)
await source.getYouTubeVideo('dQw4w9WgXcQ')
await source.searchSoundCloud('ambient', 10)
await source.getSoundCloudTrack('123456')
await source.resolveSoundCloudUrl('https://soundcloud.com/artist/track')

// Search both platforms at once
const results = await source.searchAll('chillwave')
```

### Chat

```ts
const { chat } = createApiClient({ baseURL: '...' })

await chat.getMessages('chill-lounge', beforeId, 50)
await chat.sendMessage('chill-lounge', { content: 'hello!' })
await chat.deleteMessage('chill-lounge', messageId)
```

### Friends

```ts
const { friend } = createApiClient({ baseURL: '...' })

await friend.list()
await friend.getStatus(targetUserId)
await friend.sendRequest(targetUserId)
await friend.acceptRequest(friendshipId)
await friend.remove(friendshipId)
await friend.block(targetUserId)
await friend.unblock(targetUserId)
```

### Shop

```ts
const { shop } = createApiClient({ baseURL: '...' })

await shop.getAvatarCatalog()
await shop.unlockAvatar(avatarId)
await shop.equipAvatar(avatarId)
```

### Subscriptions

```ts
const { subscription } = createApiClient({ baseURL: '...' })

await subscription.getStatus()
await subscription.createIntent('monthly')
await subscription.cancelIntent(subscriptionId)
await subscription.createPortal()
```

---

## Error Handling

All methods throw `ApiError` on failure.

```ts
import { ApiError } from '@borealise/api'

try {
  await api.auth.login({ login: 'bad', password: 'bad' })
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
const client = createApiClient({ baseURL: '...' })

// Set token after login
client.auth.login({ ... }).then(({ data }) => {
  client.api.setAuthToken(data.data.accessToken)
})

// Clear token on logout
client.api.setAuthToken(null)
```

The underlying API instance is accessible via `client.api`. Use it for token management and custom headers:

---

## Tree-Shaking

This library uses factory functions to enable tree-shaking. Bundlers like Vite, Webpack, and Rollup can exclude unused methods from your bundle.

For maximum tree-shaking, import only the factories you need:

```ts
import { createApi } from '@borealise/api'
import { createAuthResource } from '@borealise/api/resources/auth'
import { createRoomResource } from '@borealise/api/resources/room'

const api = createApi({ baseURL: '...' })
const auth = createAuthResource(api)
const room = createRoomResource(api)
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
