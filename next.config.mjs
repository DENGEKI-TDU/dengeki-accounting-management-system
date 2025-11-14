/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    let domain = "";
    if (process.env.NODE_ENV == "production") {
      domain = "https://api.dengeki-fox.net";
    } else {
      domain = "http://localhost:3006";
    }
    return [
      {
        source: "/api/redirect/getToken",
        destination: `${domain}/redirect/getToken`,
      },
      {
        source: "/api/database/earnings",
        destination: `${domain}/v1/account/database/earnings`,
      },
      {
        source: "/api/database/generate/main",
        destination: `${domain}/v1/account/database/generate/main`,
      },
      {
        source: "/api/database/generate/hatosai",
        destination: `${domain}/v1/account/database/generate/hatosai`,
      },
      {
        source: "/api/database/generate/alumni",
        destination: `${domain}/v1/account/database/generate/alumni`,
      },
      {
        source: "/api/database/generate/clubsupport",
        destination: `${domain}/v1/account/database/generate/clubsupport`,
      },
      {
        source: "/api/database/earnings",
        destination: `${domain}/v1/account/database/earnings`,
      },
      {
        source: "/api/database/post-earnings/main/income",
        destination: `${domain}/v1/account/database/post-earnings/main/income`,
      },
      {
        source: "/api/database/post-earnings/main/outcome",
        destination: `${domain}/v1/account/database/post-earnings/main/outcome`,
      },
      {
        source: "/api/database/post-earnings/hatosai/income",
        destination: `${domain}/v1/account/database/post-earnings/hatosai/income`,
      },
      {
        source: "/api/database/post-earnings/hatosai/outcome",
        destination: `${domain}/v1/account/database/post-earnings/hatosai/outcome`,
      },
      {
        source: "/api/database/post-earnings/alumni/income",
        destination: `${domain}/v1/account/database/post-earnings/alumni/income`,
      },
      {
        source: "/api/database/post-earnings/alumni/outcome",
        destination: `${domain}/v1/account/database/post-earnings/alumni/outcome`,
      },
      {
        source: "/api/database/post-earnings/clubsupport/income",
        destination: `${domain}/v1/account/database/post-earnings/clubsupport/income`,
      },
      {
        source: "/api/database/post-earnings/clubsupport/outcome",
        destination: `${domain}/v1/account/database/post-earnings/clubsupport/outcome`,
      },
      {
        source: "/api/database/post-earnings/main/update",
        destination: `${domain}/v1/account/database/post-earnings/main/update`,
      },
      {
        source: "/api/database/post-earnings/hatosai/update",
        destination: `${domain}/v1/account/database/post-earnings/hatosai/update`,
      },
      {
        source: "/api/database/post-earnings/alumni/update",
        destination: `${domain}/v1/account/database/post-earnings/alumni/update`,
      },
      {
        source: "/api/database/post-earnings/clubsupport/update",
        destination: `${domain}/v1/account/database/post-earnings/clubsupport/update`,
      },
      {
        source: "/api/database/post-earnings/main",
        destination: `${domain}/v1/account/database/post-earnings/main`,
      },
      {
        source: "/api/database/post-earnings/hatosai",
        destination: `${domain}/v1/account/database/post-earnings/hatosai`,
      },
      {
        source: "/api/database/post-earnings/alumni",
        destination: `${domain}/v1/account/database/post-earnings/alumni`,
      },
      {
        source: "/api/database/post-earnings/clubsupport",
        destination: `${domain}/v1/account/database/post-earnings/clubsupport`,
      },
      {
        source: "/api/database/post-earnings/main/move/hatoyama",
        destination: `${domain}/v1/account/database/post-earnings/main/move/hatosai`,
      },
      {
        source: "/api/database/post-earnings/main/move/alumni",
        destination: `${domain}/v1/account/database/post-earnings/main/move/alumni`,
      },
      {
        source: "/api/database/post-earnings/main/move/clubsupport",
        destination: `${domain}/v1/account/database/post-earnings/main/move/clubsupport`,
      },
      {
        source: "/api/database/post-earnings/main/move/aid",
        destination: `${domain}/v1/account/database/post-earnings/main/move/aid`,
      },
      {
        source: "/api/database/post-earnings/hatosai/move/main",
        destination: `${domain}/v1/account/database/post-earnings/hatosai/move/main`,
      },
      {
        source: "/api/database/post-earnings/hatosai/move/alumni",
        destination: `${domain}/v1/account/database/post-earnings/hatosai/move/alumni`,
      },
      {
        source: "/api/database/post-earnings/hatosai/move/clubsupport",
        destination: `${domain}/v1/account/database/post-earnings/hatosai/move/clubsupport`,
      },
      {
        source: "/api/database/post-earnings/hatosai/move/aid",
        destination: `${domain}/v1/account/database/post-earnings/hatosai/move/aid`,
      },
      {
        source: "/api/database/post-earnings/alumni/move/main",
        destination: `${domain}/v1/account/database/post-earnings/alumni/move/main`,
      },
      {
        source: "/api/database/post-earnings/alumni/move/hatosai",
        destination: `${domain}/v1/account/database/post-earnings/alumni/move/hatosai`,
      },
      {
        source: "/api/database/post-earnings/alumni/move/clubsupport",
        destination: `${domain}/v1/account/database/post-earnings/alumni/move/clubsupport`,
      },
      {
        source: "/api/database/post-earnings/alumni/move/aid",
        destination: `${domain}/v1/account/database/post-earnings/alumni/move/aid`,
      },
      {
        source: "/api/database/post-earnings/clubsupport/move/main",
        destination: `${domain}/v1/account/database/post-earnings/clubsupport/move/main`,
      },
      {
        source: "/api/database/post-earnings/clubsupport/move/hatosai",
        destination: `${domain}/v1/account/database/post-earnings/clubsupport/move/hatosai`,
      },
      {
        source: "/api/database/post-earnings/clubsupport/move/alumni",
        destination: `${domain}/v1/account/database/post-earnings/clubsupport/move/alumni`,
      },
      {
        source: "/api/database/post-earnings/clubsupport/move/aid",
        destination: `${domain}/v1/account/database/post-earnings/clubsupport/move/aid`,
      },
      {
        source: "/api/database/post-earnings/all",
        destination: `${domain}/v1/account/database/post-earnings/all`,
      },
      {
        source: "/api/session/login",
        destination: `${domain}/v1/session/login`,
      },
      {
        source: "/api/session/logout",
        destination: `${domain}/v1/session/logout`,
      },
      {
        source: "/api/session/getSession",
        destination: `${domain}/v1/session/getSession`,
      },
      {
        source: "/api/session/withPast",
        destination: `${domain}/v1/portal/account/getMembers`,
      },
      {
        source: "/api/discord/getThreadID",
        destination: `${domain}/v1/account/discord/getThreadID`,
      },
      {
        source: "/api/discord/send",
        destination: `${domain}/v1/account/discord/send`,
      },
      {
        source: "/api/discord/updateThread",
        destination: `${domain}/v1/account/discord/updateThread`,
      },
    ];
  },
};

export default nextConfig;
