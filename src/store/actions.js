import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay } from "common/js/cache"

function findIndex(list, song) {
  return list.findIndex(item => item.id === song.id)
}

export function selectPlay({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
}

export function randomPlay({ commit }, { list }) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
}

export function insertSong({ commit, state }, song) {
  let playList = state.playList.slice(0)
  let sequenceList = state.sequenceList.slice(0)
  let currentIndex = state.currentIndex
  let currentSong = playList[currentIndex]

  // 当前列表是否有待插入歌曲，返回其索引
  let fpIndex = findIndex(playList, song)
  currentIndex++;
  playList.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--;
    } else if (currentIndex < fpIndex) {
      playList.splice(fpIndex + 1, 1)
    }
  }

  let fsIndex = findIndex(sequenceList, song)
  // 当前歌曲所在索引
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  sequenceList.splice(currentSIndex, 0, song)

  // 歌曲列表包含待插入歌曲
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export function saveSearchHistory({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export function deleteSearchHistory({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export function clearSearchHistory({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export function deleteSong({ commit, state }, song) {
  let playList = state.playList.slice(0)
  let sequenceList = state.sequenceList.slice(0)
  let currentIndex = state.currentIndex

  const fpIndex = playList.findIndex(item => item.id === song.id)
  playList.splice(fpIndex, 1)

  const fsIndex = sequenceList.findIndex(item => item.id === song.id)
  sequenceList.splice(fsIndex, 1)

  // 当前播放列表的索引大于删除歌曲索引 或者 当前播放的是最后一首歌，此时播放索引必须减一
  if (currentIndex > fpIndex || currentIndex === playList.length) {
    currentIndex--;
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  // 删除掉最后一首的时候，需要把状态重置
  const playingState = playList.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export function deleteSongList({ commit }) {
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_CURRENT_INDEX, -1)
}

export function savePlayHistory({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}