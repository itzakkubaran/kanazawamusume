# coding: utf-8

require 'optparse'

# ------------------------------------------------------------------------------
#  Class: KanaMusu_Data
# ------------------------------------------------------------------------------
#
# 仕様
#
#    彼女たちが入力したデータ.csv→shopMapDataList.csvを生成するという機能です。
#    彼女たちが入力したデータ.csvは住所と店名、お店の説明、種類くらいしかありません。
#    これを作れるツールがほしいです。入力フォームがあると可。

# ------------------------
#   KanaMusu_Data
# ------------------------
class KanaMusu_Data
  #
  @@debug = false
  #
  BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json"
  OPEN_URL = "http://maps.google.co.jp/maps"
  GOOGLE_API_KEY = "AIzaSyCbAKj450-wT4MWRPiEP_iqXYnR7DQcgeA"
  #
  def initialize()
  end
  # read data from csv file.
  def read_data(filename)
    # Get header Information from CSV file
    # read CSV file.
#    @@csv_data = CSV.read(filename, headers: :first_row, converters: :numeric)
    @@csv_data = CSV.read(filename, headers:true, converters: :numeric)
    # for Debug (Start)
    if (@@debug == true) then
      p @@csv_data
      @@csv_data.each do |data|
        p data
      end
    end
    # for Debug (End)
  end
  def write_data(filename)
  end
  def convert_location()
    @@csv_data.each do |data|
      # for Debug (Start)
      if (@@debug == true) then
        p "test code : #data['番号']"
      end
      # for Debug (End)

      #
      if ((data['緯度']=="") or (data['経度']=="")) then
        encoded_address = URI.encode(data['住所'])
        url = "#{BASE_URL}?address=#{encoded_address}&key=#{GOOGLE_API_KEY}"
        uri = URI.parse(url)
        response = Net::HTTP.get_response(URI.parse(url))
        case response
        # 200 OK
        when Net::HTTPSuccess then
          map_data = JSON.parse(response.body)
          #
          data['緯度'] = map_data['results'][0]['geometry']['location']['lat']
          data['経度'] = map_data['results'][0]['geometry']['location']['lng']
        # それ以外
        else
          data['緯度'] = 0.00
          data['経度'] = 0.00
        end
      end
    end
  end
  def out_data(filename)
    @@header = ['番号','お店の名前','住所','緯度','経度','お店の種類（１：飲食店 2:和菓子 3:お土産 4:その他）','URL','紹介','定休日','営業時間','おすすめ商品']
    @@whole_csv = CSV.generate("", :headers => @@header, :write_headers => true) do |csv_data|
      @@csv_data.each do |data|
        @@out_data = [data['番号'],data['お店の名前'],data['住所'],data['緯度'],data['経度'],data['お店の種類（１：飲食店 2:和菓子 3:お土産 4:その他）'],data['URL'],data['紹介'],data['定休日'],data['営業時間'],data['おすすめ商品'] ]
        csv_data << @@out_data
        # for Debug (Start)
        if (@@debug == true) then
          p "test : #{data['番号']}"
          p "char : #{data['test']}"
          p "#{data}"
        end
        # for Debug (End)
      end
    end
    #
    File.open(filename, 'w') do |file|
      file.write(@@whole_csv)
    end
  end
end
