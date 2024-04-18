# 2024-04

## Move to api.r-pkg.org

Very similar, but it has a redis cache, so need to create that first.
Currently it has:
```
root@www:~# dokku redis:list
NAME      VERSION      STATUS   EXPOSED PORTS  LINKS
www       redis:3.2.3  running  -              -
wwwredis  redis:3.2.3  running  -              www
```
so we'll name the new one wwwredis as well, although it probably does not
matter. We don't need to copy the contents of the cache, but we can.

```
dokku plugin:install https://github.com/dokku/dokku-redis.git redis
dokku apps:create www
dokku redis:create wwwredis
dokku redis:link wwwredis www
dokku config:set www REDIS_HOST=dokku-redis-wwwredis REDIS_PORT=6379
dokku config:set www REDIS_URL=redis://dokku-redis-wwwredis:6379
dokku config:set www REDIS_HOST=dokku-redis-wwwredis REDIS_PORT=6379
dokku config:set www  GH_TOKEN=<token>
```

Turn off passwords, add redis config to www app:
```
dokku redis:connect wwwredis
127.0.0.1:6379> CONFIG SET REQUIREPASS ""
```

Copy stuff:
```
dokku redis:export wwwredis > www.db
```
and then on the new server:
```
dokku redis:import wwwredis < www.db
```

Add Dockerfile to project, update node version, etc. and then deploy:
```
git remote add dokku dokku@api.r-pkg.org:www
git push dokku
```

Do the same dance for copying the certs from the old server.

```
dokku domains:add www www.r-pkg.org
dokku domains:add www r-pkg.org
tar cf cert.tar server.{key,crt}
cat cert.tar | dokku certs:add www
```

Edit `/etc/hosts` locally to test.

Update DNS. www is proxied by Cloudflare, so turn off the
proxy temporarily, to make sure everything works correctly.
Turn the proxy back on at the end.

```
dokku letsencrypt:set www  email csardi.gabor@gmail.com
dokku letsencrypt:enable www
```

Enable proxy again.

Stop old app a couple of hours later.

