# coding: utf-8

require 'optparse'
require 'json'
require 'net/http'
require 'pp'
require 'csv'

require './lib/kanamusu_lib.rb'

# -----------------------------------------
#  Default Parameter
# -----------------------------------------
SRC_FNAME = '../data/shopMapDataList.csv'
DST_FNAME='../data/shopMapDataList.out.csv'

# -----------------------------------------
#   Main routine
# -----------------------------------------

# ------------------------
#   OptionParser
# ------------------------
OPTS = {}

OptionParser.new do |opt|
  begin
    opt.program_name = File.basename($0)
    opt.version      = '0.0.1'

    opt.banner = "Usage #{opt.program_name} [options] "

    opt.separator ''
    opt.separator 'Examples'

    opt.on('-i input file', '--input-file', 'Input file name') {|v| OPTS[:src_fname] = v}
    opt.on('-o output file', '--output-file', 'Output file name') {|v| OPTS[:dst_fname] = v}

    opt.separator ''
    opt.separator 'Common options'

    opt.on_tail('-h', '--help', "show this help message.") do
      puts opt
      exit
    end
    opt.on_tail('-v', '--version', 'show program version number.') do
      puts "#{opt.programe_name} #{opt.version}"
      exit
    end

    opt.parse!(ARGV)
  rescue => e
    puts "ERROR: #{e}.\nMake sure #{opt}"
    exit
  end
end

if OPTS[:src_fname] then src_fname = OPTS[:src_fname] else src_fname = SRC_FNAME end
if OPTS[:dst_fname] then dst_fname = OPTS[:dst_fname] else dst_fname = DST_FNAME end

# ------------------------
#  Convert Data
# ------------------------
kanamusu = KanaMusu_Data.new
kanamusu.read_data(src_fname)
kanamusu.convert_location()
kanamusu.out_data(dst_fname)

exit
