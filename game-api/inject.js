/**
 * Provides injector function
 * Fetches dependency from string, e.g. dependency name if provided in dependencies
 * Throws error if non-existing dependency is requested by name
 */
module.exports = function(dependencies) {
    dependencies = dependencies || {};
    let injector = function(dependencyName) {
        if(!dependencies[dependencyName]) {
            throw new Error("Required dependency <" + dependencyName + "> is not provided.");
        }
        return dependencies[dependencyName];
    };
    return injector;
};