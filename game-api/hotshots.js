/**
 * Creates hotshot client initialized with our data dog container
 * @param context the context/dependencies module uses
 */
module.exports = (context) => {
    const HotShots = context("hotshots");
    return new HotShots({
        host: 'my_datadog_container',
        globalTags: { env: process.env.ENVIRONMENT }
    });
};