import powerbiVisualsConfigs from "eslint-plugin-powerbi-visuals";

export default [
    powerbiVisualsConfigs.configs.recommended,
    {
        ignores: ["node_modules/**", "dist/**", ".vscode/**", ".tmp/**"],
    },
    {
        rules: {
            // innerHTML is used intentionally for DOM construction in this visual
            "powerbi-visuals/no-inner-outer-html": "off",
        },
    },
];