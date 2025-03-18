from django.shortcuts import render
from noteapp.models import Note, GoalTimer
from noteapp.serializers import NoteSerializer, UserSerializer, GoalTimerSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from django.db.models import Q
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user_id': user.id,
            'username': user.username,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user_id': user.id,
            'username': user.username,
            'token': token.key
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_user_info(request):
    if request.user.is_authenticated:
        return Response({
            'user_id': request.user.id,
            'username': request.user.username,
            'email': request.user.email
        })
    return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_notes(request):
    query = request.query_params.get("search")
    notes = Note.objects.filter(
        Q(title__icontains=query) | Q(body__icontains=query) | Q(category__icontains=query),
        user=request.user
    )
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def notes(request):
    if request.method == "GET":
        notes = Note.objects.filter(user=request.user)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        print('Files in request:', request.FILES)
        print('Data in request:', request.data)
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            note = serializer.save(user=request.user)
            if 'image' in request.FILES:
                note.image = request.FILES['image']
                note.save()
            if 'drawing' in request.FILES:
                note.drawing = request.FILES['drawing']
                note.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print('Serializer errors:', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def note_detail(request, slug):
    try:
        note = Note.objects.get(slug=slug, user=request.user)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = NoteSerializer(note)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        # Handle file uploads
        if 'image' in request.FILES:
            note.image = request.FILES['image']
            note.save()
        elif 'image' in request.data and not request.data['image']:
            # Clear the image if an empty value is sent
            note.image = None
            note.save()
            
        if 'drawing' in request.FILES:
            note.drawing = request.FILES['drawing']
            note.save()
        elif 'drawing' in request.data and not request.data['drawing']:
            # Clear the drawing if an empty value is sent
            note.drawing = None
            note.save()
            
        # Handle other data
        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Re-fetch the note to get updated URLs
            updated_note = Note.objects.get(pk=note.pk)
            updated_serializer = NoteSerializer(updated_note)
            return Response(updated_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def goal_timer(request):
    try:
        timer = GoalTimer.objects.get(user=request.user)
    except GoalTimer.DoesNotExist:
        timer = None

    if request.method == 'GET':
        if not timer:
            return Response({'goal_time': None}, status=status.HTTP_200_OK)
        serializer = GoalTimerSerializer(timer)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if timer:
            # Update existing timer
            serializer = GoalTimerSerializer(timer, data=request.data)
        else:
            # Create new timer
            serializer = GoalTimerSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_goal_timer(request):
    try:
        timer = GoalTimer.objects.get(user=request.user)
        timer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except GoalTimer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

