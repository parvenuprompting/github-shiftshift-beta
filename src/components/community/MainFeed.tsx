import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, Image as ImageIcon, User, MoreHorizontal } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  groupId?: string;
  groupName?: string;
  timestamp: string;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

export function MainFeed() {
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const { user } = useStore();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Afbeelding mag maximaal 5MB zijn');
        return;
      }
      setSelectedImage(file);
    }
  };

  const handlePost = () => {
    if (!newPost.trim() && !selectedImage) {
      toast.error('Voeg tekst of een afbeelding toe');
      return;
    }

    // TODO: Implement post creation
    toast.success('Bericht geplaatst');
    setNewPost('');
    setSelectedImage(null);
  };

  const handleLike = (postId: string) => {
    // TODO: Implement like functionality
    toast.success('Bericht geliked');
  };

  const handleComment = (postId: string) => {
    if (!newComment.trim()) {
      toast.error('Voer een reactie in');
      return;
    }

    // TODO: Implement comment functionality
    toast.success('Reactie geplaatst');
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200">
              <User className="h-full w-full p-2 text-gray-400" />
            </div>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Deel iets met de community..."
              className="flex-1 resize-none rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
          </div>
          {selectedImage && (
            <div className="relative">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="max-h-64 rounded-lg object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-2 top-2 rounded-full bg-gray-900/50 p-1 text-white hover:bg-gray-900/75"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center space-x-2 rounded-md bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200">
              <ImageIcon className="h-5 w-5" />
              <span>Foto toevoegen</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
            <button
              onClick={handlePost}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Plaatsen
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {/* Sample posts */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200">
                  <User className="h-full w-full p-2 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium">Gebruiker {i}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(), 'dd MMM yyyy HH:mm', { locale: nl })}
                  </div>
                </div>
              </div>
              <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-4 text-gray-800">
              Dit is een voorbeeldbericht voor de community feed...
            </p>

            {i % 2 === 0 && (
              <img
                src={`https://source.unsplash.com/random/800x400?truck=${i}`}
                alt="Post"
                className="mb-4 rounded-lg"
              />
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <button
                onClick={() => handleLike(`post-${i}`)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
              >
                <Heart className="h-5 w-5" />
                <span>24 likes</span>
              </button>
              <button
                onClick={() => setShowComments(showComments === `post-${i}` ? null : `post-${i}`)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
              >
                <MessageSquare className="h-5 w-5" />
                <span>12 reacties</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                <Share2 className="h-5 w-5" />
                <span>Delen</span>
              </button>
            </div>

            {showComments === `post-${i}` && (
              <div className="mt-4 space-y-4 border-t pt-4">
                {/* Comments */}
                <div className="space-y-4">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex space-x-3">
                      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200">
                        <User className="h-full w-full p-1.5 text-gray-400" />
                      </div>
                      <div className="flex-1 rounded-lg bg-gray-50 p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Gebruiker {j}</span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(), 'HH:mm', { locale: nl })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          Dit is een voorbeeldreactie...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex space-x-3">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200">
                    <User className="h-full w-full p-1.5 text-gray-400" />
                  </div>
                  <div className="flex flex-1 items-center space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Schrijf een reactie..."
                      className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleComment(`post-${i}`)}
                      className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}