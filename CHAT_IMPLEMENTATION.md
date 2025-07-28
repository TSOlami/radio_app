# Chat Component Implementation

## Overview

The chat component has been completely reworked to provide a fully responsive and functional real-time chat experience for video call participants. The implementation uses Stream Video's custom events API for real-time messaging.

## Features Implemented

### 1. Responsive Design
- **Mobile (≤768px)**: Full-screen overlay with backdrop
- **Tablet (769px-1024px)**: 350px width sidebar
- **Desktop (≥1025px)**: 380px width sidebar
- **Adaptive Layout**: Main video area adjusts automatically when chat is open

### 2. Real-time Messaging
- **Stream Video Integration**: Uses `call.sendCustomEvent()` and `call.on("custom")` for real-time communication
- **Message Broadcasting**: Messages are sent to all participants in the call
- **Duplicate Prevention**: Prevents duplicate messages using unique IDs
- **Auto-scroll**: Automatically scrolls to latest messages

### 3. User Experience
- **Loading States**: Visual feedback during message sending
- **Error Handling**: Displays error notifications for failed operations
- **Connection Status**: Shows current connection status
- **Test Button**: Debug button to test message sending functionality
- **Keyboard Support**: Enter key to send messages (Shift+Enter for new line)
- **Message Limits**: 500 character limit per message

### 4. Message Display
- **User Avatars**: Shows participant avatars for incoming messages
- **Message Bubbles**: Different styling for sent vs received messages
- **Timestamps**: Shows message time
- **User Names**: Displays sender names for incoming messages
- **Text Wrapping**: Proper text wrapping for long messages

### 5. Mobile Optimizations
- **Full-screen Overlay**: Chat takes full screen on mobile devices
- **Backdrop**: Semi-transparent overlay that closes chat when tapped
- **Touch-friendly**: Optimized for touch interactions
- **Proper Z-index**: Ensures chat appears above other elements

## Technical Implementation

### Key Components

1. **ChatPanel.tsx**: Main chat component with all functionality
2. **MeetingRoom.tsx**: Updated to handle responsive chat positioning

### Stream Video Integration

```typescript
// Sending messages
await call.sendCustomEvent({
  type: "chat_message",
  custom: {
    messageId: crypto.randomUUID(),
    message: messageText,
  },
});

// Receiving messages
call.on("custom", (event) => {
  if (event.type === "chat_message" && event.custom) {
    // Process incoming message
  }
});
```

### Responsive Breakpoints

- **Mobile**: `max-width: 768px`
- **Tablet**: `min-width: 769px and max-width: 1024px`
- **Desktop**: `min-width: 1025px`

### State Management

- **Messages**: Array of chat messages with user info and timestamps
- **Loading**: Boolean for sending state
- **Error**: String for error messages
- **Connection Status**: String showing call connection status

## Usage

### Opening Chat
Click the chat icon in the meeting controls to open the chat panel.

### Sending Messages
1. Type your message in the input field
2. Press Enter or click the send button
3. Message will be sent to all participants

### Testing
Use the "Send Test Message" button to verify the chat functionality is working.

## Debugging

The component includes extensive console logging for debugging:
- Connection status
- Message sending/receiving
- Event handling
- Error states

## Browser Compatibility

- Modern browsers with WebRTC support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Performance Considerations

- Messages are stored in component state (not persisted)
- Auto-scroll uses smooth behavior for better UX
- Duplicate message prevention reduces unnecessary re-renders
- Proper cleanup of event listeners

## Future Enhancements

1. **Message Persistence**: Store messages in database
2. **File Sharing**: Support for image/file sharing
3. **Emoji Support**: Add emoji picker
4. **Message Reactions**: Like/react to messages
5. **Typing Indicators**: Show when users are typing
6. **Message Search**: Search through chat history
7. **Message Editing**: Edit sent messages
8. **Message Deletion**: Delete own messages

## Troubleshooting

### Common Issues

1. **Messages not sending**: Check call connection status
2. **Messages not receiving**: Verify event listener setup
3. **Mobile layout issues**: Check viewport meta tag
4. **Performance issues**: Monitor message array size

### Debug Steps

1. Open browser console
2. Check for error messages
3. Verify call connection status
4. Test with "Send Test Message" button
5. Check network connectivity

## Dependencies

- `@stream-io/video-react-sdk`: For video call functionality
- `@mantine/core`: For UI components
- `@clerk/nextjs`: For user authentication
- `react-icons`: For icons

## Environment Variables

Ensure these are set for Stream Video:
- `NEXT_PUBLIC_STREAM_API_KEY`
- `STREAM_SECRET_KEY`