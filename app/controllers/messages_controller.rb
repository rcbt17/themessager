class MessagesController < ApplicationController

  before_action :generate_random_id, only: [:create]

  def new
    @message = Message.new
  end

  def create
    @message = Message.new(message_params)
    @message[:randomuid] = @id
    if @message.save
      render json: @message
    else
      render json: @message.errors, status: :unprocessable_entity
    end
  end

  private

  def generate_random_id
    @id = SecureRandom.uuid.gsub(/[^0-9a-z ]/i,'')
  end

  def message_params
    params.require(:message).permit(:content)
  end
end
