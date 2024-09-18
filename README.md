<div align="center">
   <h1>
       <a href="#"><img src="https://necord.org/img/logo.png" alt ="Necord Logo"></a>
   </h1>
   🎵 A implementation of <b><a href="https://github.com/Tomato6966/lavalink-client"> lavalink-client</a></b> for <a href="https://necord.org">Necord</a>
   <br/><br/>
   <a href="https://necord.org">Documentation ✨</a> &emsp; <a href="https://github.com/necordjs/necord">Source code 🪡</a> &emsp; <a href="https://github.com/necordjs/samples">Examples 🛠️</a> &emsp; <a href="https://discord.gg/mcBYvMTnwP">Community 💬</a>
</div>


<br/>

<p align="center">
    <a href='https://img.shields.io/npm/v/necord'><img src="https://img.shields.io/npm/v/necord" alt="NPM Version" /></a>
    <a href='https://img.shields.io/npm/l/necord'><img src="https://img.shields.io/npm/l/necord" alt="NPM License" /></a>
    <a href='https://img.shields.io/npm/dm/necord'><img src="https://img.shields.io/npm/dm/necord" alt="NPM Downloads" /></a>
    <a href='https://img.shields.io/github/last-commit/necordjs/necord'><img src="https://img.shields.io/github/last-commit/SocketSomeone/necord" alt="Last commit" /></a>
</p>

## About

Transform your bot into a professional DJ with the power of the [Lavalink](https://lavalink.dev/) ecosystem. This package
uses [lavalink-client](https://github.com/Tomato6966/lavalink-client) behind the scenes, providing a high-performance and efficient solution
for managing audio streams on Discord. By leveraging Lavalink, your bot gains the ability to manage audio playback, queues, and real-time
controls with minimal latency, transforming it into a fully capable and professional music system.

## Installation

**Node.js 18.0.0 or newer is required.**

```bash
$ npm i @necord/lavalink necord discord.js
$ yarn add @necord/lavalink necord discord.js
$ pnpm add @necord/lavalink necord discord.js
```

- [Lavalink Intallation Guide](https://lavalink.dev/getting-started/index.html)

## Usage

Once the installation process is complete, we can import the `NecordLavalinkModule` into the root `AppModule`:

```typescript
import { NecordLavalinkModule } from '@necord/lavalink';
import { Module } from '@nestjs/common';
import { Client } from 'discord.js';
import { AppUpdate } from './app.update';

@Module({
    imports: [
        NecordLavalinkModule.forRoot({
            nodes: [
                {
                    authorization: 'youshallnotpass',
                    host: 'localhost',
                    port: 2333,
                    id: 'main_node'
                }
            ]
        })
    ],
    providers: [AppUpdate]
})
export class AppModule {
}
```

Then create `app.update.ts` file and add `OnLavalinkManager`/`OnceLavalinkManager` decorators for handling LavalinkManager events and
`OnNodeManager`/`OnceNodeManager` decorators for handling NodeManager events:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Context } from 'necord';
import { OnLavalinkManager, OnNodeManager, LavalinkManagerContextOf, NodeManagerContextOf } from '@necord/lavalink';

@Injectable()
export class AppUpdate {
    private readonly logger = new Logger(AppUpdate.name);

    @OnNodeManager('connect')
    public onReady(@Context() [node]: NodeManagerContextOf<'connect'>) {
        this.logger.log(`Node: ${node.options.id} Connected`);
    }

    @OnLavalinkManager('playerCreate')
    public onPlayerCreate(@Context() [player]: LavalinkManagerContextOf<'playerCreate'>) {
        this.logger.log(`Player created at ${player.guildId}`);
    }
}
```

Whenever you need to handle any event data, use the `Context` decorator.

If you want to fully dive into Necord, check out these resources:

* [Necord Wiki](https://necord.org) - Official documentation of Necord.
* [Nest JS](https://docs.nestjs.com) - A progressive framework for creating well-architectured applications.
* [Discord JS](https://discord.js.org) - The most powerful library for creating bots.
* [Discord API](https://discord.com/developers/docs) - Official documentation of Discord API.
* [Lavalink](https://lavalink.dev/) - Official Lavalink documentation.
* [lavalink-client](https://github.com/Tomato6966/lavalink-client) - Easy, flexible and feature-rich lavalink@v4 Client.

## Backers

<a href="https://opencollective.com/necord" target="_blank"><img src="https://opencollective.com/necord/backers.svg?width=1000"></a>

## Stay in touch

* Author - [Alexey Filippov](https://t.me/socketsomeone)
* Twitter - [@SocketSomeone](https://twitter.com/SocketSomeone)

## License

[MIT](https://github.com/necordjs/necord/blob/master/LICENSE) © [Alexey Filippov](https://github.com/SocketSomeone)
