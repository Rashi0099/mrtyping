from django.contrib import admin
from .views import RegisterView,ProfileView,TypingResult,LevelCompletion,LeaderboardView
# Register your models here.
admin.site.register(RegisterView)
admin.site.register(ProfileView)
admin.site.register(TypingResult)
admin.site.register(LevelCompletion)
admin.site.register(LeaderboardView)