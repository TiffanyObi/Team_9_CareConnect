export function PreferenceFields({ preferences, onChange, compact = false }) {
  const setPreference = (name, value) => onChange({ ...preferences, [name]: value });

  return (
    <div className={compact ? 'preference-fields preference-fields--compact' : 'preference-fields'}>
      <div className="form-field">
        <label htmlFor="textScale">Text size</label>
        <select
          id="textScale"
          value={preferences.textScale}
          onChange={(event) => setPreference('textScale', event.target.value)}
        >
          <option value="100">Standard (100%)</option>
          <option value="125">Large (125%)</option>
          <option value="150">Extra large (150%)</option>
          <option value="200">Maximum (200%)</option>
        </select>
        <p className="field-help">The layout reflows as text becomes larger.</p>
      </div>

      <label className="toggle-row">
        <span>
          <strong>High contrast</strong>
          <small>Strengthen borders and text contrast.</small>
        </span>
        <input
          type="checkbox"
          checked={preferences.highContrast}
          onChange={(event) => setPreference('highContrast', event.target.checked)}
        />
      </label>

      <label className="toggle-row">
        <span>
          <strong>Reduce motion</strong>
          <small>Remove nonessential movement and transitions.</small>
        </span>
        <input
          type="checkbox"
          checked={preferences.reducedMotion}
          onChange={(event) => setPreference('reducedMotion', event.target.checked)}
        />
      </label>
    </div>
  );
}
