from django.urls import path 
from . import views 


urlpatterns = [
    path("notes/", views.notes, name="notes"),
    path("notes/<slug:slug>/", views.note_detail, name="note-detail"),
    path("notes-search/", views.search_notes, name='notes-search'),
    path("register/", views.register_user, name='register'),
    path("login/", views.login_user, name='login'),
    path("user-info/", views.get_user_info, name='user-info'),
    path("goal-timer/", views.goal_timer, name="goal-timer"),
    path("goal-timer/delete/", views.delete_goal_timer, name="delete-goal-timer"),
]

# endpoints:
# GET_ALL_NOTES_and_CREATE_NEW_NOTE = "127.0.0.1:8008/notes/"
# GET_SPECIFIC_NOTE = "127.0.0.1:8008/notes/note-slug"
# SEARCH_NOTES = "127.0.0.1:8008/notes-search/?search=meeting"
# REGISTER_USER = "127.0.0.1:8008/register/"
# LOGIN_USER = "127.0.0.1:8008/login/"
# GET_USER_INFO = "127.0.0.1:8008/user-info/"