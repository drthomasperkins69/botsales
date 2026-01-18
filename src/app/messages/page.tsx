'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Send, ArrowLeft, User, Check, CheckCheck } from 'lucide-react';
import { useAuthStore, useMessagesStore, useListingsStore } from '@/store';
import { mockUsers } from '@/data/users';
import { formatDate } from '@/lib/utils';

export default function MessagesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { getConversationsByUser, getMessagesByConversation, sendMessage, markAsRead } = useMessagesStore();
  const { getListingById } = useListingsStore();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/messages');
    }
  }, [isAuthenticated, router]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const conversations = getConversationsByUser(user.id);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    sendMessage(selectedConversation, user.id, messageText.trim());
    setMessageText('');
    // Scroll to bottom after sending
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectConversation = (convId: string) => {
    setSelectedConversation(convId);
    markAsRead(convId, user.id);
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const messages = selectedConversation ? getMessagesByConversation(selectedConversation) : [];
  const otherParticipantId = selectedConv?.participants.find((p) => p !== user.id);
  const otherParticipant = otherParticipantId ? mockUsers.find((u) => u.id === otherParticipantId) : null;
  const listing = selectedConv ? getListingById(selectedConv.listingId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Messages</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <div
              className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${
                selectedConversation ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Conversations</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {conversations.map((conv) => {
                      const otherUser = mockUsers.find(
                        (u) => u.id === conv.participants.find((p) => p !== user.id)
                      );
                      const convListing = getListingById(conv.listingId);
                      const convMessages = getMessagesByConversation(conv.id);
                      const unreadMessages = convMessages.filter(
                        (m) => m.senderId !== user.id && !m.read
                      );

                      return (
                        <button
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv.id)}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                            selectedConversation === conv.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {otherUser?.avatar ? (
                              <img
                                src={otherUser.avatar}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-gray-900 truncate">
                                  {otherUser?.name || 'Unknown User'}
                                </span>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {formatDate(conv.updatedAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate mt-0.5">
                                Re: {convListing?.title || 'Listing'}
                              </p>
                              {conv.lastMessage && (
                                <p className="text-sm text-gray-500 truncate mt-1">
                                  {conv.lastMessage.senderId === user.id ? 'You: ' : ''}
                                  {conv.lastMessage.content}
                                </p>
                              )}
                            </div>
                            {unreadMessages.length > 0 && (
                              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {unreadMessages.length}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-1">No messages yet</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Start a conversation by contacting a seller
                    </p>
                    <Link href="/search" className="text-blue-600 hover:text-blue-700 font-medium">
                      Browse Robots
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Message Thread */}
            <div
              className={`flex-1 flex flex-col ${
                selectedConversation ? 'flex' : 'hidden md:flex'
              }`}
            >
              {selectedConversation && selectedConv ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    {otherParticipant?.avatar ? (
                      <img
                        src={otherParticipant.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {otherParticipant?.name || 'Unknown User'}
                      </h3>
                      {listing && (
                        <Link
                          href={`/listing/${listing.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 truncate block"
                        >
                          Re: {listing.title}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Listing Preview */}
                    {listing && (
                      <Link
                        href={`/listing/${listing.id}`}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <img
                          src={listing.images[0] || '/placeholder-robot.jpg'}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{listing.title}</h4>
                          <p className="text-sm text-gray-500">
                            ${listing.price.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    )}

                    {messages.map((message) => {
                      const isOwn = message.senderId === user.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                              isOwn
                                ? 'bg-blue-600 text-white rounded-br-md'
                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                                isOwn ? 'text-blue-200' : 'text-gray-400'
                              }`}
                            >
                              <span>{formatDate(message.createdAt)}</span>
                              {isOwn && (
                                message.read ? (
                                  <CheckCheck className="w-3 h-3" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500">
                      Choose a conversation from the list to view messages
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
