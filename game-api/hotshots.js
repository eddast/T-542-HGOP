/**
 * Creates hotshot client initialized with our data dog container
 * @param context the context/dependencies module uses
 */
module.exports = (context) => {
    const HotShots = context("hotshots");
    return HotShots('my_datadog_container');
};