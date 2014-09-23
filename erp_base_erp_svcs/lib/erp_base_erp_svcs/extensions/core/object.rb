Object.instance_eval do
  def all_subclasses
    klasses = self.subclasses
    (klasses | klasses.collect do |klass| klass.all_subclasses end).flatten.uniq
  end

  def class_exists?(class_name)
    class_name.to_s.constantize
    true
  rescue NameError
    false
  end
end