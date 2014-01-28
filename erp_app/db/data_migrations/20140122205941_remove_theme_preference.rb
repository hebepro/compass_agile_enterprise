class RemoveThemePreference
  
  def self.up
    extjs_theme = PreferenceType.find_by_internal_identifier('extjs_theme')

    ValidPreferenceType.destroy_all("preference_type_id = #{extjs_theme.id}")

    Preference.where('preference_type_id = ?', extjs_theme).each do |preference|
      user_preference = UserPreference.where('preference_id = ?', preference.id).first
      user_preference.destroy if user_preference

      preference.destroy
    end

  end
  
  def self.down
    #remove data here
  end

end
