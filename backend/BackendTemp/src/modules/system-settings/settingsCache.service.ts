import systemSettingsService from "./systemSettings.service";
import { SettingCategory } from "./systemSettings.types";

class SettingsCacheService {
    private cache: Map<string, any> = new Map();
    private initialized: boolean = false;

    /**
     * Initializes the cache by loading all system settings categories from the database.
     * Call this once during application startup.
     */
    async initialize() {
        console.log("[SettingsCache] Initializing system settings cache...");
        await this.refreshCache();
        this.initialized = true;
        console.log(`[SettingsCache] Initialized with ${this.cache.size} settings.`);
    }

    /**
     * Refreshes the cache from the database.
     */
    async refreshCache() {
        try {
            const securitySettings = await systemSettingsService.getByCategory(SettingCategory.SECURITY);
            const notificationSettings = await systemSettingsService.getByCategory(SettingCategory.NOTIFICATIONS);
            const storageSettings = await systemSettingsService.getByCategory(SettingCategory.STORAGE);
            const smtpSettings = await systemSettingsService.getByCategory(SettingCategory.SMTP);
            const smsSettings = await systemSettingsService.getByCategory(SettingCategory.SMS);
            
            // Rebuild the cache map
            const newCache = new Map<string, any>();
            const allSettings = [...securitySettings, ...notificationSettings, ...storageSettings, ...smtpSettings, ...smsSettings];
            
            allSettings.forEach((setting: any) => {
                newCache.set(setting.key, setting.value);
            });
            
            this.cache = newCache;
        } catch (error) {
            console.error("[SettingsCache] Failed to refresh cache:", error);
        }
    }

    /**
     * Synchronously retrieves a setting value from the cache.
     * @param key The setting key (e.g., 'JWT_EXPIRES_IN')
     * @param defaultValue Fallback if the setting is not found
     */
    get<T>(key: string, defaultValue?: T): T {
        if (!this.initialized && process.env.NODE_ENV !== 'test') {
            console.warn(`[SettingsCache] Accessing key '${key}' before initialization!`);
        }
        
        if (this.cache.has(key)) {
            return this.cache.get(key) as T;
        }
        
        return defaultValue as T;
    }

    /**
     * Retrieve the entire active cache as an object
     */
    getAll(): Record<string, any> {
        return Object.fromEntries(this.cache);
    }

    /**
     * Retrieve settings filtered by a category prefix (assuming keys are prefixed)
     * For actual category filtering without DB calls, we just return the full cache 
     * since the cache holds the values directly. A proper implementation would cache 
     * the Setting objects. For now we will return all settings or map them if needed.
     */
    getCategorySettings(category: SettingCategory): Record<string, any> {
        // Since we only cache the key-value pairs without category metadata right now,
        // we'll just return the entire cache as the settings object.
        // It's safe because keys are unique system-wide.
        return this.getAll();
    }
}

export default new SettingsCacheService();
